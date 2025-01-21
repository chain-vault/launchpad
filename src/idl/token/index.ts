// export * from './devnet/token_factory';
// export { default as TokenFactoryIdl } from './devnet/token_factory.json'
export * from './mainnet/token_factory';
export { default as TokenFactoryIdl } from './mainnet/token_factory.json'

// import { ApeonFastlaunch as DevnetApeonFastlaunch } from './devnet/apeon_fastlaunch';
// import DevnetFastLauchIdl from './devnet/apeon_fastlaunch.json';

// import { ApeonFastlaunch as MainnetApeonFastlaunch } from './mainnet/apeon_fastlaunch';
// import MainnetFastLauchIdl from './mainnet/apeon_fastlaunch.json';

// import { BASE_CONFIG } from '@constants/config';

// let ApeonFastlaunch;
// let FastLauchIdl;

// if (BASE_CONFIG.network === 'devnet') {
//   ApeonFastlaunch = DevnetApeonFastlaunch;
//   FastLauchIdl = DevnetFastLauchIdl;
// } else {
//   ApeonFastlaunch = MainnetApeonFastlaunch;
//   FastLauchIdl = MainnetFastLauchIdl;
// }

// export { ApeonFastlaunch, FastLauchIdl };