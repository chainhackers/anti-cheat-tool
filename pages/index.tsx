import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { Button, PoweredBy } from 'components';
import styles from '../styles/Home.module.scss';

import companies from 'data/partners.json';

interface IHomePageProps {
  partners: { image: string; name: string; href: string }[];
}
const Home: NextPage<IHomePageProps> = ({ partners }) => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Head>
        <title>Anti-cheat tool by ChainHackers Gamejutsu</title>
        <meta name="description" content="Anti-cheat tool by Gamejutsu ChainHackers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.h1}>
          {t('frontpage.introduction.l1')}
          <br></br>
          {t('frontpage.introduction.l2')}
        </h1>
        <p className={styles.description}>
          <span>{t('frontpage.description.l1')}</span>
          <span>{t('frontpage.description.l2')}</span>
        </p>
        <div className={styles.tryButton}>
          <Button
            value={t('buttons.tryDemo')!}
            onClick={() => {
              router.push('/games');
            }}
            width={'w200'}
            color="black"
          />
        </div>
        <div className={styles.logo}>
          <Image
            src="/images/front-ninja.webp"
            alt="GameJutsu Logo"
            width="500"
            height="330"
            // layout="fill"
          />
        </div>
        <div className={styles.proweredby}>
          <PoweredBy poweredByList={partners} />
        </div>
      </main>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<IHomePageProps> = () => {
  return {
    props: {
      partners: companies,
    },
  };
};
