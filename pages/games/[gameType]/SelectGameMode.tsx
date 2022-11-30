import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import { useWalletContext } from 'contexts';
import styles from 'styles/SelectGameMode.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
const SelectGameModePage = () => {
  const { t } = useTranslation();
  const { userAddress } = useWalletContext();
  const { query } = useRouter();
  return (
    <div className={styles.container}>
      <div className={styles.title}>{t('selectGame.title')}</div>
      <div className={styles.description}>{t('selectGame.description')}</div>
      <div className={styles.avatar}>
        <Image src={'/images/empty_avatar.png'} alt={'avatat'} width="61" height="61"></Image>
      </div>
      <div className={styles.userName}>
        {userAddress ? userAddress : t('selectGame.unknownUser')}
      </div>

      <div className={styles.selection}>
        <div className={styles.new}>
          <div className={styles.title}>{t('selectGame.new.title')}</div>
          <div className={styles.description}>{t('selectGame.new.description')}</div>
          <Link href={'/games/' + query.gameType + '?game=3'}>
            <div className={styles.button}>
              <span>{t('selectGame.new.button')}</span>
            </div>
          </Link>
        </div>
        <div className={styles.join}>
          <div className={styles.title}>{t('selectGame.join.title')}</div>
          <div className={styles.description}>{t('selectGame.join.description')}</div>
          <Link href={'/games/' + query.gameType + '/JoinGame'}>
            <div className={styles.button}>
              <span>{t('selectGame.join.button')}</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SelectGameModePage;
