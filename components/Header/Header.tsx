import { WalletConnector, Navigation, Logo } from 'components';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { IHeaderProps } from './HeaderProps';
import styles from './Header.module.scss';
export const Header: React.FC<IHeaderProps> = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Logo image={'/images/gj-logo.webp'} href="/" />
      </div>
      <div className={styles.nav}>
        <Navigation />
      </div>
      <div className={styles.connect}>
        <WalletConnector />
        <ConnectButton />
      </div>
    </div>
  );
};
