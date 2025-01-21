import { Keypair } from '@solana/web3.js';
import { Meta, StoryObj } from '@storybook/react';

import { WalletInfoButonActions } from '@constants/index';
import useWalletConnection from '@hooks/useWalletConnection.mock';
import { useWeb3React, walletMocked } from '@hooks/useWeb3React.mock';

import WalletInfoButton from './WalletInfoButton';

const meta: Meta<typeof WalletInfoButton> = {
  argTypes: {
    action: {
      control: { control: false },
    },
  },
  component: WalletInfoButton,
  title: 'Components/WalletInfoButton',
};

export default meta;

type Story = StoryObj<typeof WalletInfoButton>;

export const WithDisconnectWallet: Story = {
  args: {
    action: WalletInfoButonActions.DISCONNECT_WALLET,
  },
  async beforeEach() {
    // use ts ignore such that, for mocking it is not required to entire mocked values
    /** @ts-ignore */
    useWeb3React.mockReturnValue({
      publicKey: new Keypair().publicKey,
      wallet: walletMocked,
    });
    /** @ts-ignore */
    useWalletConnection.mockReturnValue({
      isConnected: true,
    });
  },
};

export const WithOpenWalletModal: Story = {
  args: {
    action: WalletInfoButonActions.OPEN_WALLET_MODAL,
  },
  async beforeEach() {
    // use ts ignore such that, for mocking it is not required to entire mocked values
    /** @ts-ignore */
    useWeb3React.mockReturnValue({
      publicKey: new Keypair().publicKey,
      wallet: walletMocked,
    });
    /** @ts-ignore */
    useWalletConnection.mockReturnValue({
      isConnected: true,
    });
  },
};

export const DisconnectedWallet: Story = {
  args: {
    action: WalletInfoButonActions.DISCONNECT_WALLET,
  },
  async beforeEach() {
    // use ts ignore such that, for mocking it is not required to entire mocked values
    /** @ts-ignore */
    useWeb3React.mockReturnValue({
      publicKey: new Keypair().publicKey,
      wallet: walletMocked,
    });
    /** @ts-ignore */
    useWalletConnection.mockReturnValue({
      isConnected: false,
    });
  },
};
