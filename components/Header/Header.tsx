import { useTranslation } from 'react-i18next';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Logo, Navigation, NavPath } from 'components';
import { HeaderPropsI } from './HeaderProps';
import styles from './Header.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
export const Header: React.FC<HeaderPropsI> = () => {
  const { t } = useTranslation();
  const { asPath } = useRouter();
  const parsedPath = asPath.split('/').filter((el) => el.length !== 0);
  const currentPath = parsedPath[0];

  return (
    <div className={styles.container}>
      {asPath !== '/' && <NavPath path={asPath} />}
      <div className={styles.left}>
        <Link href="/">
          <a>
            <Logo />
          </a>
        </Link>
        <Link href="/">
          <a>
            <div className={styles.title}>{t('header.title')}</div>
          </a>
        </Link>
      </div>
      <div className={styles.right}>
        <Navigation active={currentPath} />
        <ConnectButton />
      </div>
    </div>
  );
};
