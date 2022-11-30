import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { useWalletContext } from 'contexts';
import { ChatLog, ConnectWalletModal, GameField, LeftPanel, RightPanel } from 'components';
import { TicTacToe, PlayerType as TicTacToePlayerType } from 'components/Games/Tic-Tac-Toe';
import { TicTacToeState } from 'components/Games/Tic-Tac-Toe/types';
import { IAnyMessage, ISignedGameMove, PlayerI, TGameType } from 'types';

import styles from 'styles/GameType.module.scss';
import { useEffect, useState } from 'react';

import testmessage1 from 'data/test-message1.json';
import testmessage2 from 'data/test-message2.json';
import { IGameState, TPlayer } from 'components/Games/types';
import { useRouter } from 'next/router';
import { getSigner } from 'gameApi';
import { useInterval } from 'hooks/useInterval';

interface IGamePageProps {
  gameType: TGameType;
}
interface IParams extends ParsedUrlQuery {
  gameType: string;
}

const FETCH_OPPONENT_ADDRESS_TIMEOUT = 2500;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const Game: NextPage<IGamePageProps> = ({ gameType }) => {
  const [players, setPlayers] = useState<PlayerI[]>([]);
  const [isTimeoutInited, setIsTimeoutInited] = useState<boolean>(false);
  const [isResolveTimeOutAllowed, setIsResolveTimeOutAllowed] = useState<boolean>(false);
  const [isFinishTimeoutAllowed, setIsFinishTimeoutAllowed] = useState<boolean>(false);
  const [isTimeoutRequested, setIsTimeoutRequested] = useState<boolean>(false);
  const [isDisputAvailable, setIsDisputeAvailavle] = useState<boolean>(false);
  const [playerIngameId, setPlayerIngameId] = useState<0 | 1>(0);
  const [opponentAddress, setOpponentAddress] = useState<string | null>(null);

  let gameState: IGameState<any, any>;
  let setGameState: (arg0: any) => void;

  const { query } = useRouter();

  const gameId = parseInt(query.game as string);

  const getInitialState = () => {
    const playerType: TPlayer = playerIngameId === 0 ? 'X' : 'O';
    // if (gameType == 'tic-tac-toe') {
    return new TicTacToeState({ gameId, playerType });
    // }
    // return new CheckersState({ gameId, playerType });
  };

  [gameState, setGameState] = useState<IGameState<any, any>>(getInitialState());

  const { userAddress, isConnected } = useWalletContext();

  const client = false;
  const isInDispute = false;
  const finishedGameState = null;

  const playersTypesMap: { [id in TGameType]: { 0: JSX.Element; 1: JSX.Element } } = {
    'tic-tac-toe': {
      0: <TicTacToePlayerType playerIngameId={0} />,
      1: <TicTacToePlayerType playerIngameId={1} />,
    },
    checkers: {
      0: <TicTacToePlayerType playerIngameId={0} />,
      1: <TicTacToePlayerType playerIngameId={1} />,
    },
  };

  const collectedMessages: IAnyMessage[] = [
    { ...(testmessage1 as IAnyMessage) },
    { ...(testmessage2 as IAnyMessage) },
  ];

  const setConversationHandler = async () => {
    console.log('setConversationHandler');
  };

  const initTimeoutHandler = async () => {
    console.log('init timeout handler');
  };

  const resolveTimeoutHandler = async () => {
    console.log('resolveTimeoutHandler');
  };

  const finishTimeoutHandler = async () => {
    console.log('finishTimeoutHandler');
  };

  const runDisputeHandler = async () => {
    console.log('runDisputeHandler');
  };

  const sendSignedMoveHandler = async (signedMove: ISignedGameMove) => {
    // sendMessage({
    //   gameId: gameId,
    //   message: signedMove,
    //   messageType: 'ISignedGameMove',
    //   gameType,
    // });
  };

  useEffect(() => {
    const isPlayerMoves = (
      gameType: TGameType,
      gameState: IGameState<any, any>,
      playerIngameId: 0 | 1,
    ) => {
      switch (gameType) {
        case 'checkers':
          return playerIngameId === 0
            ? !gameState.currentBoard.redMoves
            : gameState.currentBoard.redMoves;
        case 'tic-tac-toe':
          return playerIngameId === gameState.nonce % 2;
        default:
          throw new Error(`unknown game type: ${gameType}`);
      }
    };

    console.log(gameId, userAddress);

    setPlayers([
      {
        playerName: playerIngameId === 0 ? 'Player1' : 'Player2',
        address: gameId && userAddress ? userAddress : null,
        avatarUrl: '/images/empty_avatar.png',
        playerType: playersTypesMap[gameType][playerIngameId],
        moves: isPlayerMoves(gameType, gameState, playerIngameId),
      },
      {
        playerName: playerIngameId === 1 ? 'Player1' : 'Player2',
        address: opponentAddress,
        avatarUrl: '/images/empty_avatar.png',
        playerType: playersTypesMap[gameType][playerIngameId === 0 ? 1 : 0],
        moves: !isPlayerMoves(gameType, gameState, playerIngameId),
      },
    ]);
  }, [opponentAddress, gameId, gameType, gameState]);

  useInterval(async () => {
    if (opponentAddress) {
      return;
    }
    if (!gameId) {
      return;
    }
    if (!userAddress) {
      return;
    }
    // console.log('polling for opponent address, gameId=', gameId);
    // let players: [string, string] = await gameApi.getPlayers(
    //   getArbiter(),
    //   BigNumber.from(gameId),
    // );
    const players = [
      // TODO: delete mocked
      'tz1eqJtX6Gyv9ZVmcTFo4pB34TTLcCkmnxPi',
      'tz1NZL7y2b8oPTJv1vXzfhwyV7UKXQoGaPQ7',
    ];

    if (
      !(players[0] === ZERO_ADDRESS && players[1] === ZERO_ADDRESS) &&
      !players.includes(userAddress)
    ) {
      throw new Error(`Player ${userAddress} is not in game ${gameId}, players: ${players}`);
    }
    const inGameId = players.indexOf(userAddress) == 0 ? 0 : 1;
    setPlayerIngameId(inGameId);
    let opponent = players[1 - inGameId];
    if (!opponent || opponent == ZERO_ADDRESS) {
      return;
    }
    setOpponentAddress(opponent);
  }, FETCH_OPPONENT_ADDRESS_TIMEOUT);

  return (
    <div className={styles.container}>
      {!isConnected && <ConnectWalletModal />}
      <LeftPanel
        players={players}
        isTimeoutAllowed={!isTimeoutInited}
        initTimeout={initTimeoutHandler}
        isResolveTimeoutAllowed={isResolveTimeOutAllowed}
        resolveTimeout={resolveTimeoutHandler}
        isFinishTimeOutAllowed={isFinishTimeoutAllowed}
        finishTimeout={finishTimeoutHandler}
        isTimeoutRequested={isTimeoutRequested}
        // isTimeoutRequested={true}
        onRunDisput={runDisputeHandler}
        isDisputAvailable={isDisputAvailable}
        // connectPlayer={connectPlayerHandler}
      />
      <GameField
        gameId={gameId?.toString()}
        rivalPlayerAddress={opponentAddress}
        isConnected={!!client}
        isInDispute={isInDispute}
        finishedGameState={finishedGameState}
        onConnect={setConversationHandler}
      >
        <TicTacToe
          gameState={gameState as TicTacToeState}
          getSignerAddress={() => {
            return getSigner().getAddress();
          }}
          sendSignedMove={sendSignedMoveHandler}
        />
      </GameField>
      <RightPanel>
        <ChatLog anyMessages={collectedMessages} isLoading={false} />
      </RightPanel>
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
