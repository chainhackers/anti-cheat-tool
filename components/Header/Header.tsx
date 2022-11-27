import { IHeaderProps } from './HeaderProps';
import styles from './Header.module.scss';
import { WalletConnector } from 'components';
export const Header: React.FC<IHeaderProps> = () => {
  return (
    <div className={styles.container}>
      <div className={styles.connect}>
        <WalletConnector />
      </div>
    </div>
  );
};
