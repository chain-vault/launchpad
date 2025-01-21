const isFeatureEnabled = (feature: string) => import.meta.env[`VITE_${feature}`] === '1';

export const isApeInPoolCreationEnabled = isFeatureEnabled('APEIN_POOL_CREATE');
export const isApeInTradeEnabled = isFeatureEnabled('APEIN_TRADE');
export const isApeInBubbleMapEnabled = isFeatureEnabled('APEIN_BUBBLE_MAP');
export const isApeInEmbeddedWalletEnabled = isFeatureEnabled('APEIN_EMBBEDED_WALLET');
