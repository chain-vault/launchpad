import { useRef, useState } from 'react';

import Query from '@irys/query';
import { WebIrys } from '@irys/sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { ArweaveSigner, DataItem, type Tag } from 'arbundles';
import isFunction from 'lodash/isFunction';

import { FilePreviewType } from '@app-types/index';

import {
  ARWEAVE_FREE_UPLOAD_SIZE,
  BASE_CONFIG,
  FileUploadStatus,
  IRYS_FILE_PREFIX,
} from '@constants/index';

// import useToast from './useToast';

const useWebIrys = () => {
  const wallet = useWallet();
  const { network, rpcUrl } = BASE_CONFIG;
  // const { errorToast } = useToast();
  const [uploadStatus, setUploadStatus] = useState<FileUploadStatus>(FileUploadStatus.UPLOAD_IDLE);

  const irysQuery = new Query({
    network,
  });

  const getWebIrys = async () => {
    if (wallet.publicKey) {
      const walletIrys = { name: 'apeon', provider: wallet, rpcUrl };
      const config = {
        network,
        token: 'solana',
        wallet: walletIrys,
      };
      const webIrysInstance = new WebIrys(config);

      await webIrysInstance.ready();
      return webIrysInstance;
    }
  };

  const getFilePreview = async (fileId: string): Promise<FilePreviewType | undefined> => {
    try {
      const results = await irysQuery.search('irys:transactions').ids([fileId]);
      if (results.length)
        return {
          isUploaded: true,
          name: results?.[0]?.tags?.[0]?.value ?? '',
          preview: `${IRYS_FILE_PREFIX}${fileId}`,
          size: parseFloat(results?.[0]?.tags?.[2]?.value ?? '0'),
          type: results?.[0]?.tags?.[1]?.value ?? '',
        };
    } catch (err) {
      console.error(err);
      return undefined;
    }
  };
  const getFileTags = (fileTags: Tag[], file: File): Tag[] => {
    const hasContentType =
      fileTags ? fileTags.some(({ name }) => name.toLowerCase() === 'content-type') : false;

    return hasContentType ? fileTags : (
        [...(fileTags ?? []), { name: 'Content-Type', value: file.type }]
      );
  };
  const fundArweaveNode = async (size: number, webIrys: WebIrys, onStartFunding?: () => void) => {
    const atomicBalance = await webIrys.getLoadedBalance();
    const price = await webIrys.getPrice(size);
    if (atomicBalance.isLessThan(price)) {
      setUploadStatus(FileUploadStatus.FUNDING_ARWEAVE_NODE);
      if (isFunction(onStartFunding)) {
        onStartFunding();
      }
      await webIrys.fund(price, 1.2);
    }
  };
  const uploadFile = async (file: File, fileTags: Tag[] = []) => {
    try {
      setUploadStatus(FileUploadStatus.UPLOAD_INIT);
      const webIrys = await getWebIrys();
      if (!webIrys) {
        setUploadStatus(FileUploadStatus.UPLOAD_ERROR);
        return;
      }

      const tags = getFileTags(fileTags, file);
      const { size } = file;

      // fund arweave node
      if (size >= ARWEAVE_FREE_UPLOAD_SIZE) {
        await fundArweaveNode(size, webIrys);
      }
      setUploadStatus(FileUploadStatus.SIGNING_MESSAGE);
      const receipt = await webIrys.uploadFile(file, { tags });
      setUploadStatus(FileUploadStatus.UPLOAD_SUCCESS);
      return receipt;
    } catch (err) {
      setUploadStatus(FileUploadStatus.UPLOAD_ERROR);
      // errorToast('Failed to upload file');
      return null;
    }
  };

  type TxData = {
    signer?: ArweaveSigner;
    size: number;
    tags: Tag[];
    txMap: Map<string, string>;
    txs: DataItem[];
  };
  const TX_INITIAL_DATA: TxData = {
    size: 0,
    tags: [],
    txMap: new Map(),
    txs: [],
  };

  const txData = useRef<TxData>(TX_INITIAL_DATA);
  type MultiFileArray = {
    file: File;
    fileTags: Tag[];
  };
  const addFileToQue = async (
    { file, fileTags }: MultiFileArray,
    options?: Partial<{
      onComplete: (txId: string) => void;
      onError: (error: Error | string) => void;
      onStart: () => void;
      replaceExistingQue?: boolean;
    }>
  ): Promise<null | string | undefined> => {
    if (options && options.replaceExistingQue) {
      txData.current = TX_INITIAL_DATA;
    }
    const webIrys = await getWebIrys();
    if (!webIrys) {
      setUploadStatus(FileUploadStatus.UPLOAD_ERROR);
      if (isFunction(options?.onError)) {
        options.onError(FileUploadStatus.UPLOAD_ERROR);
      }
      return;
    }
    if (!txData.current.signer) {
      const throwawayKey = await webIrys.arbundles.getCryptoDriver().generateJWK();
      txData.current.signer = new ArweaveSigner(throwawayKey);
    }
    const content = Buffer.from(await file.arrayBuffer());
    const { name: path } = file;
    const tags = getFileTags(fileTags, file);
    const tx = webIrys.arbundles.createData(content, txData.current.signer, {
      tags,
    });
    txData.current.tags = [...txData.current.tags, ...tags];
    txData.current.size += file.size;
    try {
      if (isFunction(options?.onStart)) {
        options.onStart();
      }
      await tx.sign(txData.current.signer);
      txData.current.txs.push(tx);
      txData.current.txMap.set(path, tx.id);
      if (isFunction(options?.onComplete)) {
        options.onComplete(tx.id);
      }
      return tx.id;
    } catch (e) {
      if (isFunction(options?.onError)) {
        options.onError(e as Error);
      }
    }
  };

  const uploadBundle = async (options?: {
    onComplete?: <T>(res: T) => void;
    onError?: (error: Error | string) => void;
    onFunding?: () => void;
    onStart?: () => void;
  }) => {
    const webIrys = await getWebIrys();
    if (!webIrys) {
      if (isFunction(options?.onError)) {
        options.onError(FileUploadStatus.UPLOAD_ERROR);
      }
      return;
    }

    if (txData.current.size > ARWEAVE_FREE_UPLOAD_SIZE) {
      await fundArweaveNode(txData.current.size, webIrys, options?.onFunding);
    }
    const manifest = await webIrys.uploader.generateManifest({
      items: txData.current.txMap,
    });
    if (txData.current.signer) {
      const manifestTx = webIrys.arbundles.createData(
        JSON.stringify(manifest),
        txData.current.signer,
        {
          tags: [
            { name: 'Type', value: 'manifest' },
            {
              name: 'Content-Type',
              value: 'application/x.arweave-manifest+json',
            },
            ...(txData.current.tags ?? []),
          ],
        }
      );

      await manifestTx.sign(txData.current.signer);
      txData.current.txs.push(manifestTx);
      if (isFunction(options?.onStart)) {
        options.onStart();
      }
      const response = await webIrys.uploader.uploadBundle(txData.current.txs);
      if (response) {
        if (isFunction(options?.onComplete)) {
          options.onComplete(response);
        }
        return response;
      }
    }
  };
  return {
    addFileToQue,
    getFilePreview,
    setUploadStatus,
    uploadBundle,
    uploadFile,
    uploadStatus,
  };
};
export default useWebIrys;
