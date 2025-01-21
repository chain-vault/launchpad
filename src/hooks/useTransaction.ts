import { useCallback, useMemo } from 'react';

import { transactionSettings } from '@atoms/index';
import {
  ComputeBudgetProgram,
  type Signer,
  type TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { useAtomValue } from 'jotai';

import { NETWORK_ERROR } from '@constants/programErrors';
import { waitTransactionSignatureConfirmation } from '@utils/transaction';

import { getConnection, useWeb3Provider, useWeb3React } from './useWeb3React';

const useTransaction = (updateTransactionId: (txId: string) => void, isLBP = true) => {
  const { sendTransaction, wallet } = useWeb3React();
  const provider = useWeb3Provider(true);
  const { customRPCUrl, priorityFees, selectedRPC } = useAtomValue(transactionSettings);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const connection = useMemo(() => getConnection(), [customRPCUrl, selectedRPC]);

  const sendAndConfirmTransaction = useCallback(
    async (instructions: TransactionInstruction[], signers: Signer[] | undefined) => {
      const instructionsWithPriorityFee = instructions;
      if (!provider || !wallet) throw new Error('Wallet not connected');
      let latestBlockhash;
      try {
        latestBlockhash = await connection.getLatestBlockhash('confirmed');
      } catch {
        throw new Error(NETWORK_ERROR);
      }

      if (Number(priorityFees)) {
        const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: Number(priorityFees),
        });
        instructionsWithPriorityFee.unshift(addPriorityFee);
      }
      const messageV0 = new TransactionMessage({
        instructions,
        payerKey: provider.publicKey,
        recentBlockhash: latestBlockhash.blockhash,
      }).compileToV0Message();

      const transaction = new VersionedTransaction(messageV0);

      // const response = await fetch(BASE_CONFIG.rpcUrl, {
      //   body: JSON.stringify({
      //     id: '1',
      //     jsonrpc: '2.0',
      //     method: 'getPriorityFeeEstimate',
      //     params: [
      //       {
      //         options: { includeAllPriorityFeeLevels: true },
      //         transaction: base58.encode(transaction.serialize()), // Pass the serialized transaction in Base58
      //       },
      //     ],
      //   }),
      //   headers: { 'Content-Type': 'application/json' },
      //   method: 'POST',
      // });
      // const result = await response.json();

      // console.log(result);

      // try {
      //   const serializedTransaction = transaction.serialize();
      //   const transactionSize = serializedTransaction.length; // Size in bytes

      //   console.log(`Transaction size: ${transactionSize} bytes`);

      //   const simulationResult = await connection.simulateTransaction(transaction);

      //   if (simulationResult.value.err) {
      //     console.error('Simulation failed:', simulationResult.value.err);
      //     throw new Error(
      //       `Transaction simulation failed: ${JSON.stringify(simulationResult.value.err)}`
      //     );
      //   } else {
      //     console.log('Simulation successful:', simulationResult.value);
      //   }
      // } catch (error) {
      //   console.error('Error simulating transaction:', error);
      //   throw new Error('Transaction simulation error');
      // }

      const txId = await sendTransaction(transaction, connection, {
        signers,
        skipPreflight: true,
      });
      updateTransactionId(txId);

      await waitTransactionSignatureConfirmation(txId, connection, isLBP);
      return txId;
    },
    [provider, wallet, priorityFees, sendTransaction, connection, updateTransactionId, isLBP]
  );

  return {
    sendAndConfirmTransaction,
  };
};

export default useTransaction;
