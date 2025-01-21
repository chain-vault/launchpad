import { atom, createStore, type Getter, type Setter } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { Slippage } from '@app-types/index';

import { AUTO_SLIPPAGE_VALUE, MAX_SLIPPAGE_VALUE } from '@constants/config';
import { PriorityFees, RPCOptions } from '@constants/config/transactions';
import { UserAuthenticationStatus } from '@constants/index';

export const jotaiStore = createStore();

// Auth related atoms
type UserAuth = {
  authenticationStatus: UserAuthenticationStatus;
  disconnectWallet?: () => void;
  publickKey?: string;
};

type TradeReferalCodes = {
  [publicKey: string]: {
    [poolId: string]: string;
  };
};

type TransactionSettings = {
  customRPCUrl: string;
  priorityFees: PriorityFees;
  selectedRPC: RPCOptions;
  showConfirmationPopUp: boolean;
  slippage: '' | number | Slippage;
};

export const walletConnectModalAtom = atom<boolean>(false);

export const userAuthAtom = atom<UserAuth>({
  authenticationStatus: UserAuthenticationStatus.NOT_AUTHORIZED,
  disconnectWallet: undefined,
  publickKey: undefined,
});

export const updateAuthStatusAtom = atom(null, (get, set, updatedUserAuth: Partial<UserAuth>) => {
  const currentAuth = get(userAuthAtom);
  set(userAuthAtom, {
    ...currentAuth,
    ...updatedUserAuth,
    // make publicKey undefined if any other status other than USER_AUTHENTICATED comes
    ...(updatedUserAuth.authenticationStatus &&
      updatedUserAuth?.authenticationStatus !== UserAuthenticationStatus.USER_AUTHENTICATED && {
        publickKey: undefined,
      }),
  });
});

export const updateDisconnectWalletAtom = atom(null, (get, set, disconnectWallet: () => void) => {
  const currentAuth = get(userAuthAtom);
  set(userAuthAtom, {
    ...currentAuth,
    disconnectWallet,
  });
});

export const userAuthTokenAtom = atomWithStorage<string>('gmtValue', '', undefined, {
  getOnInit: true,
});
export const userAuthTokenWriteAtom = atom(null, (_get, set, newToken: string) => {
  set(userAuthTokenAtom, newToken);
});

export const confettiAtom = atom<{ interval: number; isConfettiActive: boolean }>({
  interval: 0,
  isConfettiActive: true,
});

// user referal code
export const userReferalCode = atomWithStorage<{ [publicKey: string]: string }>(
  'referal-code',
  {},
  undefined,
  { getOnInit: true }
);
export const tradeReferalCode = atomWithStorage<TradeReferalCodes>(
  'trade-referals',
  {},
  undefined,
  { getOnInit: true }
);
// handle the slippage alone for now
export const transactionSettings = atomWithStorage<TransactionSettings>(
  'user-txn-settings',
  {
    customRPCUrl: '',
    priorityFees: PriorityFees.MEDIUM,
    selectedRPC: RPCOptions.HELIUS,
    showConfirmationPopUp: false,
    slippage: Slippage.AUTO,
  },
  undefined,
  { getOnInit: true }
);

export const transactionSettingsReadOnly = atom((get) => get(transactionSettings));
export const slippageValueAtom = atom((get) => {
  const { slippage } = get(transactionSettings);
  if (slippage === Slippage.AUTO || slippage === '') return AUTO_SLIPPAGE_VALUE;
  if (slippage === Slippage.MAX || parseFloat(slippage.toString()) === 100)
    return MAX_SLIPPAGE_VALUE;
  return slippage;
});
export const updateSlippageAtom = atom(null, (get, set, newSlippage: '' | number | Slippage) => {
  const currentSettings = get(transactionSettings);
  set(transactionSettings, { ...currentSettings, slippage: newSlippage });
});

export const updateTransactionSettingsAtom = atom(
  null,
  <K extends keyof TransactionSettings>(
    get: Getter,
    set: Setter,
    [key, value]: [K, TransactionSettings[K]]
  ) => {
    const currentSettings = get(transactionSettings);
    set(transactionSettings, { ...currentSettings, [key]: value });
  }
);

type LockedTokens = {
  [mint: string]: {
    escrowTokenAccount: string;
    lockedAmount: string;
    owner: string;
  }[];
};

export const lockedTokenAtom = atom<LockedTokens>({});

type SelectedWallet = {
  isEmbededPhantom: boolean;
  name: null | string;
};
export const lastSelectedWallet = atomWithStorage<SelectedWallet>(
  'selectedWallet',
  {
    isEmbededPhantom: false,
    name: null,
  },
  undefined,
  {
    getOnInit: true,
  }
);
