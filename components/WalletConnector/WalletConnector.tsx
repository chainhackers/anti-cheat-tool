import { IWalletConnectorProps } from './WalletConnectorProps';
import styles from './WalletConnector.module.scss';
import { Button } from 'components';
import { useEffect, useState } from 'react';

import { useWalletContext } from 'contexts';

export const WalletConnector: React.FC<IWalletConnectorProps> = () => {
  const [isShowConnecting, setIsShowConnecting] = useState<boolean>(true);

  const {
    setIsConnected,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
  } = useWalletContext();

  const connectWalletHandler = () => {
    connectWallet();
    setIsConnected(true);
  };

  const discconnectWalletHandler = () => {
    setIsConnected(false);
    disconnectWallet();
  };

  useEffect(() => {
    if (isConnecting) {
      setIsShowConnecting(isConnecting);
      
    }
    setTimeout(() => setIsShowConnecting(isConnecting), 500);
  }, [isConnecting]);

  return (
    <div className={styles.container}>
      {isConnected ? (
        <Button
          value={isShowConnecting ? 'connecting...' : 'discconnect wallet'}
          onClick={discconnectWalletHandler}
        />
      ) : (
        <Button
          value={isShowConnecting ? 'connecting...' : 'connect wallet'}
          onClick={connectWalletHandler}
        />
      )}
    </div>
  );
};
