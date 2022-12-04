import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import styles from '../styles/Home.module.scss';
// import 'i18n/index';
import { Button } from 'components';
import { PoweredBy } from 'components/PoweredBy';

import companies from 'data/partners.json';
import { useRouter } from 'next/router';

interface IHomePageProps {
  partners: { image: string; name: string; href: string }[];
}
const Home: NextPage<IHomePageProps> = ({ partners }) => {
  const { t } = useTranslation();

  const router = useRouter();

return (
    <div className={styles.container}>
      <Head>
        <title>GameJutsu</title>
        <meta name="description" content="Framework for on chain game developers" />
        <link rel="icon" href="favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.introductionBlock}>
          <div className={styles.intro}>{t('frontpage.introduction.l1')}</div>
          <div className={styles.intro}>{t('frontpage.introduction.l2')}</div>
          <div className={styles.description}>{t('frontpage.description.l1')}</div>
          <div className={styles.description}>{t('frontpage.description.l2')}</div>
          <div className={styles.tryButton}>
            <Button
              title={t('buttons.tryDemo')}
              color="black"
              borderless
              // onClick={() => router.push('/games')}
            />
          </div>
        </div>
        <div className={styles.sponsorBlock}>
          <div className={styles.logo}>
            <Image
              src="/logo/front-ninja.png"
              alt="GameJutsu Logo"
              width="600px"
              height="400px"
              // layout="fill"
            />
          </div>
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
