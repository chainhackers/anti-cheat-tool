import { GetStaticProps, NextPage } from 'next/types';
import { useTranslation } from 'react-i18next';
import { GameThumbnail } from 'components';
import { useWalletContext } from 'contexts';
import styles from 'styles/Games.module.scss';

import games from 'data/games.json';

interface IGamesPageProps {
  games: { name: string; image: string; url: string }[];
}

const GamesPage: NextPage<IGamesPageProps> = ({ games }) => {
  const { t } = useTranslation();
  const { userAddress } = useWalletContext();

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>{t('gameTypePage.title')}</h1>
      <p className={styles.description}>{t('gameTypePage.description')}</p>

      <div className={styles.gamelist}>
        {games &&
          games.map((game, index) => {
            return (
              <GameThumbnail
                key={game.name + index}
                {...game}
                name={t(`gameTypePage.games.${game.name}`)}
                url={`/games/${game.url}/SelectGameMode`}
              />
            );
          })}
      </div>
    </div>
  );
};

export default GamesPage;

export const getStaticProps: GetStaticProps<IGamesPageProps> = () => {
  return {
    props: {
      games: games,
    },
  };
};
