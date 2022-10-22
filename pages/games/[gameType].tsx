import { useEffect, useState, useRef } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { XMTPChatLog } from 'components/XMTPChatLog';
import { useWalletContext } from 'contexts/WalltetContext';
import {
  GameField,
  JoinGame,
  LeftPanel,
  RightPanel,
  SelectGame,
  SelectPrize,
} from 'components';

import styles from 'pages/games/gameType.module.scss';
import { ETTicTacToe } from "components/Games/ET-Tic-Tac-Toe";
import { TicTacToeState } from "components/Games/ET-Tic-Tac-Toe/types";
import { PlayerI } from "../../types";
import gameApi, { _isValidSignedMove, getArbiter, getSigner, getRulesContract, finishGame, disputeMove, initTimeout, resolveTimeout, finalizeTimeout, FinishedGameState } from "../../gameApi";
import { ISignedGameMove, SignedGameMove } from "../../types/arbiter";
import { signMoveWithAddress } from 'helpers/session_signatures';
import { useAccount } from 'wagmi';
import { Checkers } from 'components/Games/Checkers';
import { CheckersState } from 'components/Games/Checkers/types';
import { useRouter } from 'next/router';
import { IGameState, TPlayer } from 'components/Games/types';
import useConversation, { IAnyMessage, IGameMessage, TGameType } from 'hooks/useConversation';
import { GameProposedEvent, GameProposedEventObject } from "../../.generated/contracts/esm/types/polygon/Arbiter";
import { BigNumber } from 'ethers';
import { useInterval } from 'hooks/useInterval';

interface IGamePageProps {
  gameType: TGameType
}

interface IParams extends ParsedUrlQuery {
  gameType: string;
}
const PROPOSER_INGAME_ID = 0;
const ACCEPTER_INGAME_ID = 1;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const FETCH_RIVAL_ADDRESS_TIMEOUT = 2500;

const Game: NextPage<IGamePageProps> = ({ gameType }) => {

  const initialTicTacToeState = new TicTacToeState({ gameId: 1, playerType: 'X' });

  const getInitialState = (gameId: number, playerType: TPlayer) => {
    let initialCheckersState = new CheckersState({ gameId, playerType });
    return initialCheckersState;
  }

  const [playerIngameId, setPlayerIngameId] = useState<0 | 1>(0); //TODO use in game state creation
  const [isInDispute, setIsInDispute] = useState<boolean>(false);
  const [finishedGameState, setFinishedGameState] = useState<FinishedGameState | null>(null);
  const [gameId, setGameId] = useState<BigNumber | null>(null);

  const [isDisputAvailable, setIsDisputeAvailavle] = useState<boolean>(false);

  const [opponentPlayerAddress, setOpponentPlayerAddress] = useState<string | null>(null,);


  const [isInvalidMove, setIsInvalidMove] = useState<boolean>(false);
  const [players, setPlayers] = useState<PlayerI[]>([]);


  const [isTimeoutInited, setIsTimeoutInited] = useState<boolean>(false);
  const [isResolveTimeOutAllowed, setIsResolveTimeOutAllowed] = useState<boolean>(false);
  const [isFinishTimeoutAllowed, setIsFinishTimeoutAllowed] = useState<boolean>(false);
  const [isTimeoutRequested, setIsTimeoutRequested] = useState<boolean>(false);


  const { signer } = useWalletContext();
  const { query } = useRouter();
  const account = useAccount();

  const playersTypesMap = { 0: 'X', 1: 'O' };


  let gameState: IGameState<any, any>;
  let setGameState: ((arg0: any) => void);
  if (gameType == 'tic-tac-toe') {
    [gameState, setGameState] = useState<IGameState<any, any>>(initialTicTacToeState);
  } else {
    [gameState, setGameState] = useState<IGameState<any, any>>(getInitialState(1, 'X'));
  }

  let { loading, collectedMessages, sendMessage, lastMessages } = useConversation(
    opponentPlayerAddress!,
    gameId?.toNumber()!,
    false,
    true
  )

  const setConversationHandler = async (rivalPlayerAddress: string) => {
    if (!gameId) {
      throw "No gameId"
    }
    if (!rivalPlayerAddress) {
      console.error('cant connect: no rival player address');
      return;
    }
    setOpponentPlayerAddress(rivalPlayerAddress);

    if (gameType == 'tic-tac-toe') {
      setGameState(new TicTacToeState({ gameId: gameId.toNumber(), playerType: playerIngameId === 0 ? 'X' : 'O' }));
    }
    if (gameType == 'checkers') {
      setGameState(getInitialState(gameId.toNumber(), playerIngameId === 0 ? 'X' : 'O'));
    }
  };

  const sendSignedMoveHandler = async (signedMove: ISignedGameMove) => {
    sendMessage({
      gameId: gameId!.toNumber(),
      message: signedMove,
      messageType: 'ISignedGameMove',
      gameType
    })
  };

  const runFinishGameHandler = async (nextGameState: IGameState<any, any>) => {
    if (!nextGameState.lastOpponentMove) {
      throw 'no lastOpponentMove';
    }
    if (!nextGameState.lastMove) {
      throw 'no lastMove'
    }

    let address = await getSigner().getAddress();
    const signature = await signMoveWithAddress(nextGameState.lastOpponentMove.gameMove, address);
    const signatures = [...nextGameState.lastOpponentMove.signatures, signature];
    let lastOpponentMoveSignedByAll = new SignedGameMove(
      nextGameState.lastOpponentMove.gameMove,
      signatures,
    );

    const finishedGameResult = await finishGame(getArbiter(), [
      lastOpponentMoveSignedByAll,
      nextGameState.lastMove,
    ]);
    sendMessage({
      gameId: gameId!.toNumber(),
      message: finishedGameResult,
      messageType: 'FinishedGameState',
      gameType
    })
    setFinishedGameState(finishedGameResult);
  };

  const initTimeoutHandler = async () => {
    if (!gameState.lastOpponentMove) {
      throw 'no lastOpponentMove';
    }
    if (!gameState.lastMove) {
      throw 'no lastMove'
    }
    setIsTimeoutInited(true);
    setIsFinishTimeoutAllowed(true);
    setIsResolveTimeOutAllowed(false);
    try {
      let address = await getSigner().getAddress();
      const signature = await signMoveWithAddress(gameState.lastOpponentMove.gameMove, address);
      const signatures = [...gameState.lastOpponentMove.signatures, signature];
      let lastOpponentMoveSignedByAll = new SignedGameMove(
        gameState.lastOpponentMove.gameMove,
        signatures,
      );
      console.log('lastOpponentMoveSignedByAll', lastOpponentMoveSignedByAll);

      const initTimeoutResult = await initTimeout(getArbiter(), [
        lastOpponentMoveSignedByAll,
        gameState.lastMove,
      ]);

      sendMessage({
        gameId: gameId!.toNumber(),
        message: initTimeoutResult,
        messageType: 'TimeoutStartedEvent',
        gameType
      })
    } catch (error) {
      setIsTimeoutInited(false);
      setIsFinishTimeoutAllowed(false);
      setIsResolveTimeOutAllowed(false);
      throw error;
    }
  };

  const resolveTimeoutHandler = async () => {
    if (!gameState.lastMove) {
      throw Error('no lastMove');
    }
    const resolveTimeoutResult = await resolveTimeout(getArbiter(), gameState.lastMove);
    console.log('resolveTimeoutResult', resolveTimeoutResult);
    sendMessage({
      gameId: gameId!.toNumber(),
      message: resolveTimeoutResult,
      messageType: 'TimeoutResolvedEvent',
      gameType
    })
    setIsTimeoutInited(false);
    setIsResolveTimeOutAllowed(false);
    setIsFinishTimeoutAllowed(false);
    setIsTimeoutRequested(false);
  };

  const createNewGameHandler = async (isPaid: boolean = false) => {

    let proposeGameResult: GameProposedEventObject = await gameApi.proposeGame(
      getArbiter(),
      getRulesContract(gameType).address,
      isPaid,
    );

    sendMessage({
      gameId: proposeGameResult.gameId.toNumber(),
      message: proposeGameResult,
      messageType: 'GameProposedEvent',
      gameType
    })

    setGameId(proposeGameResult.gameId);
    setPlayerIngameId(PROPOSER_INGAME_ID);
  }

  const acceptGameHandler = async (gameId: number, stake: string): Promise<void> => {
    if (!account) {
      throw new Error(`No wallet`);
    }
    if (!gameId) {
      throw new Error(`No game id`);
    }
    const acceptGameResult = await gameApi.acceptGame(
      getArbiter(),
      BigNumber.from(gameId),
      stake,
    );

    sendMessage({
      gameId: acceptGameResult.gameId.toNumber(),
      message: acceptGameResult,
      messageType: 'GameStartedEvent',
      gameType
    })

    let rivalPlayer = acceptGameResult.players[PROPOSER_INGAME_ID];
    setOpponentPlayerAddress(rivalPlayer);
    setPlayerIngameId(ACCEPTER_INGAME_ID);
    setGameId(acceptGameResult.gameId);
  };

  const finishTimeoutHandler = async () => {
    try {
      const finishedGameResult = await finalizeTimeout(getArbiter(), gameId!);
      sendMessage({
        gameId: gameId?.toNumber()!,
        message: finishedGameResult,
        messageType: 'FinishedGameState',
        gameType
      })

      setFinishedGameState(finishedGameResult);
      setIsTimeoutInited(false);
      setIsFinishTimeoutAllowed(false);
      setIsTimeoutRequested(false);
    } catch (error) {
      throw error;
    }
  };

  const runDisputeHandler = async () => {
    if (!gameState.lastOpponentMove) {
      throw 'no lastOpponentMove'; 
    }
    
    setIsInDispute(true);
    
    const finishedGameResult = await disputeMove(getArbiter(), gameState.lastOpponentMove);
    sendMessage({
      gameId: gameId!.toNumber(),
      message: finishedGameResult,
      messageType: 'FinishedGameState',
      gameType
    })

    setFinishedGameState(finishedGameResult);
    setIsInDispute(false);
  };

  useEffect(() => {
    for (let i = lastMessages.length - 1; i >= 0; i--) {
      const lastMessage = lastMessages[i];
      if (lastMessage.messageType === 'TimeoutStartedEvent') {
        setIsTimeoutInited(true);
        setIsResolveTimeOutAllowed(true);
        setIsFinishTimeoutAllowed(true);
        setIsTimeoutRequested(true);
      } else if (lastMessage.messageType === 'TimeoutResolvedEvent') {
        setIsTimeoutInited(false);
        setIsResolveTimeOutAllowed(false);
        setIsFinishTimeoutAllowed(false);
        setIsTimeoutRequested(false); //TODO consider one state instead of 4
      }
      if (lastMessage.messageType == 'ISignedGameMove') {
        const signedMove = lastMessage.message as ISignedGameMove;
        _isValidSignedMove(getArbiter(), signedMove).then((isValid) => {
          //TODO maybe replace with sender address
          const isOpponentMove = signedMove.gameMove.player === opponentPlayerAddress;
          const nextGameState = gameState.makeNewGameStateFromSignedMove(
            signedMove,
            isValid,
            isOpponentMove);
          setGameState(nextGameState);
          setIsInvalidMove(!isValid);
          if (nextGameState.getWinnerId() !== null) {
            if (playerIngameId === nextGameState.getWinnerId()) {
              runFinishGameHandler(nextGameState);
            }
          }
        });
      }
    }
  }, [lastMessages]);

  useEffect(() => {
    setPlayers([
      {
        playerName: playerIngameId === 0 ? 'Player1' : 'Player2',
        address: gameId && account.address ? account.address : null,
        avatarUrl: '/images/empty_avatar.png',
        playerType: playersTypesMap[playerIngameId],
      },
      {
        playerName: playerIngameId === 1 ? 'Player1' : 'Player2',
        address: opponentPlayerAddress,
        avatarUrl: '/images/empty_avatar.png',
        playerType: playersTypesMap[playerIngameId === 0 ? 1 : 0],
      },
    ]);
  }, [opponentPlayerAddress, gameId]);

  useEffect(() => {
    if (gameState.lastOpponentMove?.gameMove.player === opponentPlayerAddress && isInvalidMove) {
      setIsDisputeAvailavle(true);
      return;
    }
    setIsDisputeAvailavle(false);
  }, [isInvalidMove]);

  useInterval(async () => {
    if (opponentPlayerAddress) {
      return;
    }
    if (!gameId) {
      return;
    }
    console.log('in poller');
    let players: [string, string] = await gameApi.getPlayers(
      getArbiter(),
      gameId,
    );
    let rivalPlayer = players[playerIngameId == 0 ? 1 : 0];
    if (rivalPlayer == ZERO_ADDRESS) {
      return;
    }
    if (rivalPlayer) {
      setOpponentPlayerAddress(rivalPlayer);
    } else {
      setOpponentPlayerAddress(null);
    }
  }, FETCH_RIVAL_ADDRESS_TIMEOUT);

  if (!!gameType && !!query && query?.join === 'true') {
    return <JoinGame acceptGameHandler={acceptGameHandler} />;
  }
  if (!!gameType && !!query && query?.select === 'true') {
    return (
      <SelectGame
        userName={account.address}
        gameType={gameType}
      />
    );
  }

  if (!!gameType && !!query && query?.prize === 'true') {
    console.log('prize', query?.prize, query?.gameId);
    return <SelectPrize gameId={gameId?.toString()} createNewGameHandler={createNewGameHandler} />;
  }

  let gameComponent = null;
  if (gameType === 'tic-tac-toe') {
    gameComponent = <ETTicTacToe
      gameState={gameState as TicTacToeState}
      getSignerAddress={() => {
        return getSigner().getAddress()
      }}
      sendSignedMove={sendSignedMoveHandler}
    />
  }
  if (gameType === 'checkers') {
    gameComponent = <div className={styles.container}>
      <Checkers
        gameState={gameState as CheckersState}
        getSignerAddress={() => {
          return getSigner().getAddress()
        }}
        sendSignedMove={sendSignedMoveHandler}
      />
    </div>
  }
  if (gameComponent) {
    if (gameType === 'checkers') {
      return (
        <div className={styles.container}>
          {gameComponent}

          <RightPanel>
            <XMTPChatLog
              logData={[]}
              isLoading={loading} />
          </RightPanel>
        </div>
      );
    } else if (gameType === 'tic-tac-toe') {
      return (
        <div className={styles.container}>
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
            rivalPlayerAddress={opponentPlayerAddress}
            isLoading={loading}
            isInDispute={isInDispute}
            finishedGameState={finishedGameState}
            onConnect={setConversationHandler}
          >
            {gameComponent}
          </GameField>
          <RightPanel>
            <XMTPChatLog logData={[]} isLoading={loading} />
          </RightPanel>
        </div>
      );
    }
  }
  return <div>No Games Available</div>;
};

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

export default Game;
