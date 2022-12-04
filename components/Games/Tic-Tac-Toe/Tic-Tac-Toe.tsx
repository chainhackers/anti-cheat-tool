import React from 'react';
import { Board } from 'components/Games/Tic-Tac-Toe';
import { ITicTacToeProps } from './ITicTacToeProps';

import styles from './Tic-Tac-Toe.module.scss';
import { TicTacToeBoard, TTTMove } from './types';
import { getRulesContract, transition } from 'gameApi';
import { useWalletContext } from 'contexts/WalltetContext';

export const TicTacToe: React.FC<ITicTacToeProps> = ({
  gameState,
  getSignerAddress,
  sendSignedMove,
}) => {
  const boardState = gameState?.currentBoard || TicTacToeBoard.empty();
  const { userAddress } = useWalletContext();

  const clickHandler = async (i: number) => {
    if (!gameState) return;

    const move: TTTMove = TTTMove.fromMove(i, gameState.playerType);

    let address = await getSignerAddress();
    // let address = userAddress!;
    let transitionResult = await transition(
      getRulesContract('tic-tac-toe'),
      gameState.toGameStateContractParams(),
      gameState.playerId,
      move.encodedMove,
    );
    const signedMove = await gameState.signMove(
      gameState.composeMove(move, transitionResult, true, userAddress!),
      userAddress!,
    );
    sendSignedMove(signedMove);
  };

  return (
    <div className={styles.container}>
      <div className={styles.boardPanel}>
        <Board
          squares={boardState.cells}
          onClick={clickHandler}
          isFinished={!gameState || gameState?.isFinished}
          disputableMoves={boardState.disputableMoves}
        />
      </div>
    </div>
  );
};
