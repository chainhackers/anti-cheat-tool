import { AccountInfo } from '@airgap/beacon-sdk';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType, BeaconEvent, defaultEventCallbacks } from '@airgap/beacon-dapp';

interface IWalletContex {
  isConnected: boolean;
  setIsConnected: Dispatch<SetStateAction<boolean>>;
  isConnecting: boolean;
  activeAccount: AccountInfo | null;
  setActiveAccount: Dispatch<SetStateAction<AccountInfo | null>>;
  wallet: BeaconWallet | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  userAddress: string | null;
  publicToken: string | null;
}

const walletContextInitialvalue: IWalletContex = {
  isConnected: false,
  setIsConnected: () => undefined,
  isConnecting: false,
  activeAccount: null,
  setActiveAccount: () => undefined,
  wallet: null,
  connectWallet: async () => undefined,
  userAddress: null,
  publicToken: null,
  disconnectWallet: async () => undefined,
};
export const WalletContext = createContext<IWalletContex>(walletContextInitialvalue);

export const useWalletContext = () => useContext(WalletContext);

export const WalletContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(
    walletContextInitialvalue.isConnected,
  );
  const [isConnecting, setIsConnecting] = useState<boolean>(
    walletContextInitialvalue.isConnecting,
  );
  const [activeAccount, setActiveAccount] = useState<AccountInfo | null>(
    walletContextInitialvalue.activeAccount,
  );

  const [publicToken, setPublicToken] = useState<string | null>(
    walletContextInitialvalue.publicToken,
  );
  const [userAddress, setUserAddress] = useState<string | null>(
    walletContextInitialvalue.userAddress,
  );
  const [wallet, setWallet] = useState<BeaconWallet | null>(walletContextInitialvalue.wallet);

  const connectWallet = async (): Promise<void> => {
    try {
      setIsConnecting(true);
      await wallet?.requestPermissions({
        network: {
          type: NetworkType.GHOSTNET,
          rpcUrl: 'https://ghostnet.ecadinfra.com',
        },
      });

      const userAddress = await wallet?.getPKH()!;
      setUserAddress(userAddress);
      setIsConnected(true);
    } catch (error) {
      console.error(error);
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async (): Promise<void> => {
    try {
      await wallet?.clearActiveAccount();
      setUserAddress(null);
      setPublicToken(null);
      setIsConnected(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    (async () => {
      setIsConnecting(true);
      const wallet = new BeaconWallet({
        name: 'Taquito React template',
        preferredNetwork: NetworkType.GHOSTNET,
        disableDefaultEvents: true,
        eventHandlers: {
          [BeaconEvent.PAIR_INIT]: {
            handler: defaultEventCallbacks.PAIR_INIT,
          },
          [BeaconEvent.PAIR_SUCCESS]: {
            handler: (data) => setPublicToken(data.publicKey),
          },
        },
      });

      setWallet(wallet);

      const activeAccount = await wallet.client.getActiveAccount();
      setActiveAccount(activeAccount ? activeAccount : null);
      if (activeAccount) {
        const userAddress = await wallet.getPKH();
        setUserAddress(userAddress);
        setIsConnected(true);
      }
      setIsConnecting(false);
    })();
  }, []);

  const value = {
    isConnected,
    setIsConnected,
    isConnecting,
    activeAccount,
    setActiveAccount,
    wallet,
    userAddress,
    publicToken,
    connectWallet,
    disconnectWallet,
  };
  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};
