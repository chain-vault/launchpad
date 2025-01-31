import { useMemo, useRef, useState } from 'react';

import apiConfig from '@adapters/api/apiConfig';
import { transactionSettings } from '@atoms/index';
import * as anchor from '@coral-xyz/anchor';
import { BN, type Idl } from '@coral-xyz/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { Keypair, PublicKey } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Decimal from 'decimal.js';
import { useAtomValue, useSetAtom } from 'jotai';
import isFunction from 'lodash/isFunction';
import { v4 as uuid } from 'uuid';

import { isApeInPoolCreationEnabled } from '@constants/config/features';
import {
  ApeInCurveMode,
  BLOCK_BEAST_BASE_URL,
  EVENT_AUTHORITY,
  getExplorerUrl,
  IRYS_FILE_PREFIX,
  LOCK_PROGRAM_ID,
  ToastType,
  UploadSteps,
} from '@constants/index';
import {
  METADATA_FILE_UPLOAD_FAILED,
  SOMETHING_WENT_WRONG,
  TOKEN_LOGO_UPLOAD_FAILED,
  WALLET_NOT_CONNECTED,
} from '@constants/programErrors';
import { useApeInSettings } from '@hooks/apein/usePoolSettings';
import { useGetProgramInstance } from '@hooks/useGetProgramInstance';
import useWebIrys from '@hooks/useIrys';
import { createActions, useProgressiveToast } from '@hooks/useProgressiveToast';
import useTransaction from '@hooks/useTransaction';
import { getConnection, useWeb3React } from '@hooks/useWeb3React';
import { ApeonFastlaunch, FastLauchIdl } from '@idl/fastlaunch';
import { TokenFactory, TokenFactoryIdl } from '@idl/token';
import createJSONFile from '@utils/createJSONfile';
import { fileToBase64 } from '@utils/fileConversion';
import { compressString } from '@utils/textCompression';
import { Token } from '@utils/token';

import { modalStateAtom } from '../components/Create';
import { FastLaunchForm } from '../types';
import { deriveEscrow, deriveEscrowMetadata } from '../utils';

dayjs.extend(utc);

type TxDetails = {
  errorMessage: string;
  mintAddress: string;
  poolAddress: string;
  txHash: string;
};

export const METADATA_SEED = Buffer.from(anchor.utils.bytes.utf8.encode('metadata'));
export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);
export function getMintMetadataAddress(mint: PublicKey): [PublicKey, number] {
  const [metadataAddress, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from(METADATA_SEED), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    TOKEN_METADATA_PROGRAM_ID
  );
  return [new PublicKey(metadataAddress), bump];
}

const useMintToken = (onSuccess?: (data: string[]) => void, onError?: (error: string) => void) => {
  const { customRPCUrl, selectedRPC } = useAtomValue(transactionSettings);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const connection = useMemo(() => getConnection(), [selectedRPC, customRPCUrl]);

  const formData = useRef<FastLaunchForm>({} as FastLaunchForm);
  const [txDetails, setTxDetails] = useState<TxDetails>({
    errorMessage: '',
    mintAddress: '',
    poolAddress: '',
    txHash: '',
  });

  const onSetTxId = (txId: string) => setTxDetails((prev) => ({ ...prev, txHash: txId }));
  const { showToast } = useProgressiveToast();
  const setModalState = useSetAtom(modalStateAtom);

  const { data: poolSettings } = useApeInSettings();

  const { sendAndConfirmTransaction } = useTransaction(onSetTxId);
  const tokenFactoryProgram = useGetProgramInstance<TokenFactory>(TokenFactoryIdl as Idl);
  const apeInProgram = useGetProgramInstance<ApeonFastlaunch>(FastLauchIdl as Idl);

  const { addFileToQue, uploadBundle } = useWebIrys();
  const { publicKey } = useWeb3React();
  const collateralAmount = 0;
  const createImageAndMetaData = async () => {
    const { current: data } = formData;
    const compressedDescription = compressString(data?.projectDescription || '');
    const { tokenLogo } = formData.current;
    let tokenImageId = '';
    let tokenMetaId = '';
    if (tokenLogo && tokenLogo instanceof File) {
      const tx = await addFileToQue(
        {
          file: tokenLogo,
          fileTags: [
            { name: 'file-name', value: tokenLogo.name },
            { name: 'file-type', value: tokenLogo.type },
            { name: 'file-size', value: tokenLogo.size.toString() },
          ],
        },
        {
          onError: () => {
            throw Error(TOKEN_LOGO_UPLOAD_FAILED);
          },
          replaceExistingQue: true,
        }
      );
      if (tx) {
        tokenImageId = tx;
      } else {
        throw Error(TOKEN_LOGO_UPLOAD_FAILED);
      }
    }

    if (tokenImageId) {
      const tokenMetaData = {
        dcd: data?.discord,
        description: data?.projectDescription,
        image: `${IRYS_FILE_PREFIX}${tokenImageId}`,
        isBeast: true,
        name: data?.tokenName,
        symbol: data?.tokenTicker.toUpperCase(),
        tg: data?.telegram,
        tld: compressedDescription,
        wb: data?.website,
        x: data?.twitter,
      };
      const metaDataJson = createJSONFile(tokenMetaData);
      if (!metaDataJson) throw new Error(METADATA_FILE_UPLOAD_FAILED);
      const tx = await addFileToQue(
        {
          file: metaDataJson,
          fileTags: [{ name: 'file-name', value: 'metadata.json' }],
        },
        {
          onError: () => {
            throw Error(METADATA_FILE_UPLOAD_FAILED);
          },
        }
      );
      if (tx) {
        tokenMetaId = tx;
      } else {
        throw Error(METADATA_FILE_UPLOAD_FAILED);
      }
    }
    return [tokenImageId, tokenMetaId];
  };

  const constructMintParams = async (mintAccount: Keypair, payerATA: PublicKey) => {
    if (!publicKey || !tokenFactoryProgram) {
      throw new Error(WALLET_NOT_CONNECTED);
    }
    const { current: data } = formData;
    const [, tokenMetaId] = await createImageAndMetaData();
    await uploadBundle({
      onFunding: () => {
        showToast({
          title: UploadSteps.UPLOADING_METADATA,
          type: ToastType.LOADING,
        });
      },
      onStart: () => {
        showToast({
          title: UploadSteps.UPLOADING_METADATA,
          type: ToastType.LOADING,
        });
      },
    });

    const metadataDetails = {
      name: data?.tokenName,
      symbol: data?.tokenTicker.toUpperCase(),
      uri: `${IRYS_FILE_PREFIX}${tokenMetaId}`,
    };

    const [metadataAddr] = getMintMetadataAddress(mintAccount.publicKey);

    const createTokenInstruction = await tokenFactoryProgram.methods
      .createTokenLegacy(metadataDetails)
      .accounts({
        metadata: metadataAddr,
        mint: mintAccount.publicKey,
        payerTokenAccount: payerATA,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction();

    return [createTokenInstruction];
  };

  const constructCreatePoolParams = async (
    mintAccount: Keypair,
    payerATA: PublicKey,
    baseKP: PublicKey,
    pool: PublicKey
  ) => {
    if (!publicKey || !apeInProgram) throw new Error(WALLET_NOT_CONNECTED);
    if (!poolSettings) throw new Error('Invalid pool settings');
    const { current: data } = formData;
    const name = data?.tokenName;
    const lockPeriod =
      (
        data.lockToken.locked &&
        data?.lockToken?.period &&
        !Number.isNaN(parseFloat(data?.lockToken?.period))
      ) ?
        parseFloat(data?.lockToken?.period)
      : 0;
    const selectedDex = parseFloat(data?.migrationDEX) || 0;

    const [poolTokenAccount] = PublicKey.findProgramAddressSync(
      [pool.toBytes(), TOKEN_PROGRAM_ID.toBytes(), mintAccount.publicKey.toBytes()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const createPoolInstruction = await apeInProgram.methods
      .createPool(formData.current.type, name, lockPeriod, selectedDex, ApeInCurveMode)
      .accounts({
        // curveAccounts: curveAccount,
        mint: mintAccount.publicKey,
        poolCreator: publicKey,
        poolCreatorTokenAccount: payerATA,
        poolTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction();

    const instructions = [createPoolInstruction];
    if (
      publicKey &&
      data.outToken &&
      data.outToken !== '' &&
      data.initialBuy &&
      new Decimal(data.initialBuy || 0).greaterThan(0)
    ) {
      const [traderTokenAccount] = PublicKey.findProgramAddressSync(
        [publicKey.toBytes(), TOKEN_PROGRAM_ID.toBytes(), mintAccount.publicKey.toBytes()],
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const [escrow] = deriveEscrow(baseKP, LOCK_PROGRAM_ID);
      const [escrowMetadata] = deriveEscrowMetadata(escrow, LOCK_PROGRAM_ID);

      const escrowToken = getAssociatedTokenAddressSync(
        mintAccount.publicKey,
        escrow,
        true,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      if (data.lockToken.locked) {
        const escrowTokenAccountInfo = await connection.getAccountInfo(escrowToken);

        if (!escrowTokenAccountInfo) {
          const createEscrowTokenAccountInstruction = createAssociatedTokenAccountInstruction(
            publicKey,
            escrowToken,
            escrow,
            mintAccount.publicKey,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          );
          instructions.push(createEscrowTokenAccountInstruction);
        }
      }

      const amountIn = new BN(Token.toRawAmount(data.initialBuy).valueOf());
      const swapInstruction = await apeInProgram.methods
        .buy(formData.current.type, amountIn, new BN(0))
        .accounts({
          base: baseKP,
          escrow,
          escrowMetadata,
          escrowToken,
          lockEventAuthority: EVENT_AUTHORITY,
          mint: mintAccount.publicKey,
          poolTokenAccount,
          // program: apeInProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          tradeFeeWallet: poolSettings.tradeFeeWallet,
          trader: publicKey,
          traderTokenAccount,
        })
        .instruction();
      instructions.push(swapInstruction);
    }
    return instructions;
  };

  const mintTokenAndCreatePool = async (data: FastLaunchForm) => {
    if (!isApeInPoolCreationEnabled) return null;

    const baseKP = Keypair.generate();
    const signers = [];
    formData.current = data;
    showToast({
      title: UploadSteps.CREATING_META_DATA,
      type: ToastType.LOADING,
    });
    try {
      if (!publicKey || !tokenFactoryProgram || !apeInProgram)
        throw new Error(WALLET_NOT_CONNECTED);

      const mintAccount = Keypair.generate();
      signers.push(mintAccount);
      const [payerATA] = PublicKey.findProgramAddressSync(
        [publicKey.toBytes(), TOKEN_PROGRAM_ID.toBytes(), mintAccount.publicKey.toBytes()],
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const pool = anchor.web3.PublicKey.findProgramAddressSync(
        [mintAccount.publicKey.toBuffer(), Buffer.from('fast_launch')],
        apeInProgram.programId
      )[0];

      const mintTokenInstructions = await constructMintParams(mintAccount, payerATA);
      // pool creation
      const createPoolInstructions = await constructCreatePoolParams(
        mintAccount,
        payerATA,
        baseKP.publicKey,
        pool
      );

      const instructions = [...mintTokenInstructions, ...createPoolInstructions];

      // Send transaction and wait for confirmation
      showToast({
        title: UploadSteps.CREATING_POOL,
        type: ToastType.LOADING,
      });
      if (new Decimal(data.initialBuy || 0).greaterThan(0) && data.outToken && data.outToken !== '')
        signers.push(baseKP);

      const txId = await sendAndConfirmTransaction(instructions, signers);
      showToast({
        title: UploadSteps.COMPLETED,
        type: ToastType.LOADING,
      });
      return [mintAccount.publicKey.toString(), pool.toString(), txId];
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        throw err;
      }
      throw new Error(SOMETHING_WENT_WRONG);
    }
  };
  type CreateAgentRequest = {
    agent_id: string;
    bio: string;
    content: string;
    description: string;
    greeting: string;
    image: string;
    is_token: boolean;
    mintAddress: string;
    name: string;
    poolAddress: string;
    public_key: string;
    txHash: string;
  };

  const { mutate: createAgent } = useMutation({
    mutationFn: (payload: CreateAgentRequest) =>
      apiConfig(`${BLOCK_BEAST_BASE_URL}/create-agent`, 'POST', payload, null, true),
    onError: (error) => {
      showToast({
        message: error.message,
        title: 'Failed to create beast',
        type: ToastType.FAILED,
      });
    },
  });
  const {
    error: txError,
    isError,
    isPending,
    isSuccess,
    mutate: onCreatePool,
  } = useMutation({
    mutationFn: mintTokenAndCreatePool,
    onError: (error) => {
      showToast(
        {
          actions: createActions({ onRetry: () => onCreatePool(formData.current) }),
          message: error.message,
          title: UploadSteps.FAILED,
          type: ToastType.FAILED,
        },
        { autoClose: 5000 }
      );
      if (onError && isFunction(onError)) {
        onError(error.message);
      }
    },
    onSuccess: async (data, variables) => {
      if (!data) return;
      const [mintAddress, poolAddress, txHash] = data;
      showToast(
        {
          actions: [
            { label: 'View', link: `/fast-launch/swap/${poolAddress}` },
            ...createActions({ transaction: txHash }),
          ],
          message: 'Success',
          title: UploadSteps.COMPLETED,
          type: ToastType.SUCCESS,
        },
        { autoClose: 5000 }
      );

      if (publicKey === null) {
        throw new Error(WALLET_NOT_CONNECTED);
      }
      if (!(variables.tokenLogo && variables.tokenLogo instanceof File)) {
        throw new Error('Unable to read logo to create Beast');
      }
      showToast({ title: 'Creating your beast', type: ToastType.LOADING });
      const image = await fileToBase64(variables.tokenLogo);
      const agentId = uuid();
      createAgent(
        {
          agent_id: agentId,
          bio: variables.beastBiography,
          content: '',
          description: variables.beastDescription,
          greeting: variables.beastGreeting,
          image,
          is_token: true,
          mintAddress,
          name: variables.tokenName,
          poolAddress,
          public_key: publicKey.toBase58(),
          txHash,
        },
        {
          onSuccess: () => {
            showToast(
              {
                // actions: [
                //   { label: 'View', link: `/fast-launch/swap/${poolAddress}` },
                //   ...createActions({ transaction: txHash }),
                // ],
                message: 'Success',
                title: 'Beast created successfully',
                type: ToastType.SUCCESS,
              },
              { autoClose: 5000 }
            );

            setModalState({
              beastChatLink: `https://dev.blockbeast.ai/chat/${agentId}`,
              isOpen: true,
              tradePageLink: `/fast-launch/swap/${poolAddress}?agentId=${agentId}`,
              transactionPageLink: getExplorerUrl(txHash),
            });
          },
        }
      );
      setTxDetails({
        errorMessage: '',
        mintAddress,
        poolAddress,
        txHash,
      });
      if (onSuccess && isFunction(onSuccess)) {
        onSuccess(data);
      }
    },
  });
  return {
    collateralAmount,
    isError,
    isPending,
    isSuccess,
    onCreatePool,
    token: formData.current?.tokenName,
    txDetails,
    txError,
  };
};

export default useMintToken;
