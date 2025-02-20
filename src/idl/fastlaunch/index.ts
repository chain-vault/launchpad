import { ApeonFastlaunch as DevnetApeonFastlaunch } from './devnet/apeon_fastlaunch';
import DevnetFastLauchIdl from './devnet/apeon_fastlaunch.json';

import { ApeonFastlaunch as MainnetApeonFastlaunch } from './mainnet/apeon_fastlaunch';
import MainnetFastLauchIdl from './mainnet/apeon_fastlaunch.json';

import { BASE_CONFIG } from '@constants/config';

// Configuration object mapping networks to their respective IDLs
const networkConfigs = {
  devnet: {
    FastLauchIdl: DevnetFastLauchIdl as DevnetApeonFastlaunch,
  },
  mainnet: {
    FastLauchIdl: MainnetFastLauchIdl as MainnetApeonFastlaunch,
  },
} as const;

// Strongly typed selected network
type NetworkType = keyof typeof networkConfigs;
const selectedNetwork = BASE_CONFIG.network as NetworkType;

// Get the correct type based on the network
export const FastLauchIdl = networkConfigs[selectedNetwork].FastLauchIdl;

// Type Mapping for Network Selection
type NetworkToTypeMap = {
  devnet: DevnetApeonFastlaunch;
  mainnet: MainnetApeonFastlaunch;
};

// Ensure the correct type is returned based on the selected network
export type FastLauchIdlType = NetworkToTypeMap[typeof selectedNetwork];