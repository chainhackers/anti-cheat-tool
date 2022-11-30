import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { useWalletContext } from 'contexts';
import { ConnectWalletModal } from 'components';
import { TGameType } from 'types';

import styles from 'styles/GameType.module.scss';

interface IGamePageProps {
  gameType: TGameType;
}

interface IParams extends ParsedUrlQuery {
  gameType: string;
}

const Game: NextPage<IGamePageProps> = ({ gameType }) => {
  const { userAddress, isConnected } = useWalletContext();

  return (
    <div className={styles.container}>
      {!isConnected && <ConnectWalletModal />}
      <div>Test test</div>
    </div>
  );
};
export default Game;

export const getStaticProps: GetStaticProps<IGamePageProps, IParams> = (context) => {
  console.log('context', context.params?.gameType);

  return {
    props: {
      gameType: context.params?.gameType as TGameType,
    },
  };
};

export const getStaticPaths: GetStaticPaths<IParams> = () => {
  const gamesType = ['tic-tac-toe', 'checkers', 'other'];
  const paths = gamesType.map((gameType) => ({ params: { gameType } }));
  return {
    paths,
    fallback: false,
  };
};
