import { useMemo, useState } from 'react';

import { BN, type Idl } from '@coral-xyz/anchor';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import { Keypair, PublicKey } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import omit from 'lodash/omit';

import {
  COLLATERAL_TOKEN_END_WEIGHT,
  DEFAULT_TOKEN_DECIMAL,
  getExplorerUrl,
  IRYS_FILE_PREFIX,
  LBPEnv,
  PROJECT_TOKEN_END_WEIGHT,
  ToastType,
  UploadSteps,
} from '@constants/index';
import {
  METADATA_FILE_UPLOAD_FAILED,
  SOMETHING_WENT_WRONG,
  WALLET_NOT_CONNECTED,
} from '@constants/programErrors';
import { useGetProgramInstance } from '@hooks/useGetProgramInstance';
import useWebIrys from '@hooks/useIrys';
import { useProgressiveToast } from '@hooks/useProgressiveToast';
import useTransaction from '@hooks/useTransaction';
import { useWeb3React } from '@hooks/useWeb3React';
import { ApeonLbp, LBPIdl } from '@idl/lbp';
import { TokenFactory, TokenFactoryIdl } from '@idl/token';
import createJSONFile from '@utils/createJSONfile';
import { PoolWeightedMath } from '@utils/poolWeightedMath';
import { compressString } from '@utils/textCompression';
import { Token } from '@utils/token';
import { Weights } from '@utils/weights';

import {
  tokenAndPoolInfoAtom,
  useGetAtomWithId,
  useGetMetadataFocusAtom,
  writeOnlyTabIndexAtom,
} from '../atom';

dayjs.extend(utc);

type TxDetails = {
  errorMessage: string;
  mintAddress: string;
  poolAddress: string;
  txHash: string;
};

const useMintToken = (id: string) => {
  const navigate = useNavigate();
  const [, setTabIndex] = useAtom(writeOnlyTabIndexAtom);

  const setTokenAndPoolData = useSetAtom(tokenAndPoolInfoAtom);
  const [txDetails, setTxDetails] = useState<TxDetails>({
    errorMessage: '',
    mintAddress: '',
    poolAddress: '',
    txHash: '',
  });

  const onSetTxId = (txId: string) => setTxDetails((prev) => ({ ...prev, txHash: txId }));

  const [, updateMetaDataAtom] = useAtom(useGetMetadataFocusAtom(id));

  const poolAndTokenInfo = useAtomValue(useGetAtomWithId(id));
  const {
    launchInfo,
    metadatafileArviewId = '',
    projectInfo,
    socialsInfo,
    tokenInfo,
  } = poolAndTokenInfo;

  const { fileArweaveId, tokenName, tokenSupply, tokenTicker } = tokenInfo;
  const { date, spotPrice, startWeight, tokenAmount } = launchInfo;
  const { projectDescription } = projectInfo;

  const { wallet } = useWeb3React();
  const { sendAndConfirmTransaction } = useTransaction(onSetTxId);
  const tokenFactoryProgram = useGetProgramInstance<TokenFactory>(TokenFactoryIdl as Idl);
  const lbpProgram = useGetProgramInstance<ApeonLbp>(LBPIdl as Idl);
  const { showToast } = useProgressiveToast({}, { variant: 'secondary' });
  const { uploadFile } = useWebIrys();

  const collateralAmount = useMemo(
    () =>
      spotPrice && startWeight && tokenAmount ?
        PoolWeightedMath.calculateCollateralTokenAmount({
          projectTokenAmount: tokenAmount,
          projectTokenWeight: startWeight,
          spotPrice,
        })
      : null,
    [spotPrice, startWeight, tokenAmount]
  );

  const constructMintParams = async (mintAccount: Keypair) => {
    if (!wallet?.adapter?.publicKey || !tokenFactoryProgram) {
      throw new Error(WALLET_NOT_CONNECTED);
    }

    let metadaDataReceiptId = metadatafileArviewId;

    if (!metadaDataReceiptId) {
      const compressedDescription = compressString(projectDescription);

      // create the json file of metadata:
      const tokenMetaData = {
        dcd: socialsInfo.discord,
        description: tokenName,
        gh: socialsInfo.github,
        image: `${IRYS_FILE_PREFIX}${fileArweaveId}`,
        name: tokenName,
        rmp: projectInfo.roadmap,
        symbol: tokenTicker,
        tg: socialsInfo.telegram,
        tld: compressedDescription,
        wb: projectInfo.website,
        wp: projectInfo.whitePaper,
        x: socialsInfo.twitter,
      };

      const metaDataJson = createJSONFile(tokenMetaData);
      if (!metaDataJson) throw new Error(METADATA_FILE_UPLOAD_FAILED);
      const metadaDataReceipt = await uploadFile(metaDataJson, [
        { name: 'file-name', value: 'metadata.json' },
      ]);
      if (!metadaDataReceipt) throw new Error(METADATA_FILE_UPLOAD_FAILED);

      metadaDataReceiptId = metadaDataReceipt.id;
      updateMetaDataAtom(metadaDataReceipt.id);
    }

    const [payerATA] = PublicKey.findProgramAddressSync(
      [
        wallet.adapter.publicKey.toBytes(),
        TOKEN_2022_PROGRAM_ID.toBytes(),
        mintAccount.publicKey.toBytes(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const createTokenInstruction = await tokenFactoryProgram.methods
      .createToken({
        name: tokenName,
        supply: new BN(tokenSupply),
        symbol: tokenTicker,
        uri: `${IRYS_FILE_PREFIX}${metadaDataReceiptId}`,
      })
      .accounts({
        mint: mintAccount.publicKey,
        payer: wallet?.adapter?.publicKey,
        payerTokenAccount: payerATA,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .instruction();

    return [createTokenInstruction];
  };

  const constructCreatePoolParams = async (
    mintAccount: Keypair,
    payerATA: PublicKey,
    pool: PublicKey
  ) => {
    if (!wallet?.adapter?.publicKey || !lbpProgram || !collateralAmount)
      throw new Error(WALLET_NOT_CONNECTED);

    // pool creation
    const name = tokenName;
    const collateralTokenAmount = new BN(Token.toRawAmount(collateralAmount).valueOf());

    const collateralTokenStartWeight = new BN(Weights.getOppositeWeight(startWeight));
    const collateralTokenEndWeight = new BN(COLLATERAL_TOKEN_END_WEIGHT);

    const projectTokenAmount = new BN(
      Token.toRawAmount(tokenAmount, DEFAULT_TOKEN_DECIMAL).valueOf()
    );

    const projectTokenStartWeight = new BN(startWeight);

    const projectTokenEndWeight = new BN(PROJECT_TOKEN_END_WEIGHT);

    const startDate = dayjs(date).utc().unix();
    const endDate = dayjs(date).add(3, 'days').utc().unix();

    const [poolTokenAccount] = PublicKey.findProgramAddressSync(
      [pool.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), mintAccount.publicKey.toBytes()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const createPoolInstruction = await lbpProgram.methods
      .createPool(
        name,
        mintAccount.publicKey,
        collateralTokenAmount,
        collateralTokenStartWeight,
        collateralTokenEndWeight,
        projectTokenAmount,
        projectTokenStartWeight,
        projectTokenEndWeight,
        startDate,
        endDate,
        LBPEnv
      )
      .accounts({
        mint: mintAccount.publicKey,
        poolCreator: wallet?.adapter?.publicKey,
        poolCreatorTokenAccount: payerATA,
        poolTokenAccount,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .instruction();

    return [createPoolInstruction];
  };

  const mintTokenAndCreatePool = async () => {
    try {
      if (!wallet?.adapter?.publicKey || !tokenFactoryProgram || !lbpProgram)
        throw new Error(WALLET_NOT_CONNECTED);

      const mintAccount = Keypair.generate(); // this will be the keypair of token to be created
      const [payerATA] = PublicKey.findProgramAddressSync(
        [
          wallet.adapter.publicKey.toBytes(),
          TOKEN_2022_PROGRAM_ID.toBytes(),
          mintAccount.publicKey.toBytes(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      const [pool] = PublicKey.findProgramAddressSync(
        [mintAccount.publicKey.toBuffer(), Buffer.from('lbp_launch')],
        lbpProgram.programId
      );

      showToast({
        title: UploadSteps.UPLOADING_METADATA,
        type: ToastType.LOADING,
      });

      const mintTokenInstructions = await constructMintParams(mintAccount);
      showToast({
        title: UploadSteps.CREATING_POOL,
        type: ToastType.LOADING,
      });
      // pool creation

      const createPoolInstructions = await constructCreatePoolParams(mintAccount, payerATA, pool);

      const instructions = [...mintTokenInstructions, ...createPoolInstructions];

      const txId = await sendAndConfirmTransaction(instructions, [mintAccount]);

      return [mintAccount.publicKey.toString(), pool.toString(), txId];
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error(SOMETHING_WENT_WRONG);
    }
  };

  const {
    isError,
    isPending,
    isSuccess,
    mutate: onCreatePool,
  } = useMutation({
    mutationFn: mintTokenAndCreatePool,
    onError: (error) => {
      showToast({
        actions: [
          { label: 'Retry', onClick: onCreatePool },
          ...(txDetails.txHash ?
            [{ label: 'View Transaction', link: getExplorerUrl(txDetails.txHash) }]
          : []),
        ],
        message: error.message ?? '',
        title: UploadSteps.FAILED,
        type: ToastType.FAILED,
      });
      setTxDetails((prev) => ({
        ...prev,
        errorMessage: error.message,
      }));
    },
    onSuccess: (data) => {
      const [mintAddress, poolAddress, txHash] = data;
      showToast({
        actions: [
          {
            label: 'View Pool',
            link: `/lbp/swap/${poolAddress}`,
          },
          {
            label: 'View Transaction',
            link: getExplorerUrl(txHash),
          },
        ],
        title: UploadSteps.COMPLETED,
      });
      setTxDetails({
        errorMessage: '',
        mintAddress,
        poolAddress,
        txHash,
      });
      setTokenAndPoolData((currentStateData) => {
        const newState = { ...currentStateData };
        return omit(newState, id);
      });
      setTabIndex(0);
      navigate({
        search: {
          draft: 'new',
        },
        to: '/lbp/create',
      });
    },
  });
  return {
    collateralAmount,
    isError,
    isPending,
    isSuccess,
    onCreatePool,
    token: tokenInfo.tokenName,
    txDetails,
  };
};

export default useMintToken;
