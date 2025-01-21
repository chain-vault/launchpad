export type EventData = {
  amountIn: string;
  amountOut: string;
  collateralTokenBalance: string;
  date: number;
  eventName: 'poolBuyEvent' | 'poolSellEvent';
  formatedDate: string;
  id: string;
  projectTokenBalance: string;
  signature: string;
  tokenInAddress: string;
  tokenOutAddress: string;
  trader: string;
};
