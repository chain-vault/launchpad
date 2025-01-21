import { ToggleButtonOption } from '@app-types/index';

export enum Slippage {
  AUTO = 'Auto',
  MAX = 'Max',
}
export enum PriorityFees {
  HIGH = '6500000',
  MEDIUM = '200000',
  NORMAL = '0',
}
export enum RPCOptions {
  CUSTOM = 'custom',
  HELIUS = 'helius',
}

export const SLIPPAGE_CONSTANTS = [
  { id: '5', displayValue: '5%', value: '5' },
  { id: '7.5', displayValue: '7.5%', value: '7.5' },
  { id: '15', displayValue: '15%', value: '15' },
  { id: 'max', displayValue: 'MAX', value: Slippage.MAX },
];

export const TRADE_TYPE_OPTIONS: ToggleButtonOption[] = [
  { id: 'buy', label: 'Buy', value: 'buy' },
  { id: 'sell', highlightColor: true, label: 'Sell', value: 'Sell' },
];
export const SLIPPAGE_TYPE_OPTIONS: ToggleButtonOption[] = [
  { id: 'auto', label: 'Auto', value: 'auto' },
  { id: 'custom', label: 'Custom', value: 'custom' },
];

export const PriorityFeesOptions: ToggleButtonOption[] = [
  { id: 'normal', label: 'Normal', value: PriorityFees.NORMAL },
  { id: 'medium', label: 'Medium', value: PriorityFees.MEDIUM },
  { id: 'high', label: 'High', value: PriorityFees.HIGH },
];

export const RPCToggleOptions: ToggleButtonOption[] = [
  { id: RPCOptions.HELIUS, label: 'Helius RPC', value: RPCOptions.HELIUS },
  { id: RPCOptions.CUSTOM, label: 'Custom RPC', value: RPCOptions.CUSTOM },
];
