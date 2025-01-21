export const LBP_PROGRAM_ERRORS_MAP: Record<number, { message: string; name: string }> = {
  6000: { message: 'LBP is paused', name: 'SystemProcessPaused' },
  6002: { message: 'Start date must be in the future', name: 'invalidStartTime' },
  6003: { message: 'Signer is not authorized', name: 'unauthorizedSigner' },
  6004: { message: 'Platform user not authorized', name: 'unauthorizedPlatform' },
  6005: { message: 'Increase slippage and try again', name: 'outputTooSmall' },
  6006: { message: 'Pool is not open yet', name: 'poolNotOpended' },
  6007: { message: 'Pool is closed', name: 'poolClosed' },
  6009: { message: 'Swap failed: high slippage', name: 'highSlippage' },
  6010: { message: 'Insufficient SOL balance', name: 'insufficientSolBalance' },
};

export const FAST_LAUNCH_PROGRAM_ERRORS_MAP: Record<number, { message: string; name: string }> = {
  6000: {
    message: 'fastlaunch process is paused',
    name: 'systemProcessPaused',
  },
  6001: {
    message: 'unauthorized signer',
    name: 'unauthorizedSigner',
  },
  6002: {
    message: 'unauthorized platform wallet',
    name: 'unauthorizedPlatform',
  },
  6003: {
    message: 'select dex platform is not valid',
    name: 'invalidDexPlatform',
  },
  6004: {
    message: 'invaild mint',
    name: 'invaildMint',
  },
  6005: {
    message: 'mint supply mismatch',
    name: 'mintSupplyMismatch',
  },
  6006: {
    message: 'pool does not have sufficient balance',
    name: 'insufficientSolInPool',
  },
  6007: {
    message: "The provided fee does not match the program owner's constraints",
    name: 'invalidFee',
  },
  6008: {
    message:
      'The price change exceeds your allowed slippage limit. Please adjust the slippage tolerance or try again.',
    name: 'exceededSlippage',
  },
  6009: {
    message: 'amount_in should be greater than zero',
    name: 'inVaildAmountIn',
  },
  6010: {
    message: 'mint address mismatch',
    name: 'mismatchMint',
  },
  6011: {
    message: 'pool creator address mismatch',
    name: 'invaildPoolCreator',
  },
  6012: {
    message: 'pool market cap reached',
    name: 'poolMarketCapReached',
  },
  6013: {
    message: 'invaild lock program',
    name: 'invaildLockProgram',
  },
  6014: {
    message: 'liquidity creation failed: CurveThreshold not reached.',
    name: 'curveThresholdNotReached',
  },
  6015: {
    message: 'liquidity creator wallet miss match.',
    name: 'invaildLiquidityCreator',
  },
  6016: {
    message: 'liquidity already withdrawn',
    name: 'duplicateliquidityWithdrawRequest',
  },
  6017: {
    message: 'liquidity withdraw pending',
    name: 'liquidityWithdrawPending',
  },
  6018: {
    message: 'liquidity address already updated',
    name: 'duplicateLiquidityAddressUpdateRequest',
  },
  6019: {
    message: 'liquidity address is not updated',
    name: 'liquidityAddressUpdatePending',
  },
};

export const PROGRAM_ERROR = 'Program error';

export const NETWORK_ERROR = 'Network error';
export const TRANSACTION_TIMED_OUT =
  'Transaction timed out. It may have been successful or failed. Please check the blockchain explorer to confirm the status, or try again if necessary.';
export const WALLET_NOT_CONNECTED = 'Wallet not connected';

export const METADATA_FILE_UPLOAD_FAILED = 'Failed to upload token metadata';
export const TOKEN_LOGO_UPLOAD_FAILED = 'Failed to upload token logo';
export const SOMETHING_WENT_WRONG = 'Something went wrong';

export const UNAUTHORIZED_SIGNER_OR_FUND_CLAIMED =
  'Signer is not authorized / Fund already claimed';
