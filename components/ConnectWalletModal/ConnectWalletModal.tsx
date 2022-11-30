import { useTranslation } from 'react-i18next';
import { WalletConnector } from 'components/WalletConnector';
import { IConnectWalletModalProps } from './ConnectWalletModalProps';
import styles from './ConnectWalletModal.module.scss';
export const ConnectWalletModal: React.FC<IConnectWalletModalProps> = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.container} onClick={(e) => e.stopPropagation()}>
      <div className={styles.dialog}>
        <h1 className={styles.h1}>{t('connectPage.description')}</h1>
        <div className={styles.wallets}>{t('connectPage.wallets')}</div>
        <WalletConnector />
      </div>
    </div>
  );
};
