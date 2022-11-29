import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import styles from 'styles/Page404.module.scss';
const Page404 = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.code}>404</div>
      <div className={styles.message}>{t('page404.message')}</div>
    </div>
  );
};

export default Page404;
