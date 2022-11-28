import { useRouter } from 'next/router';
import styles from './gameType.module.scss';
import { useWalletContext } from 'contexts';
import {
  getDocumentById,
  db,
  updateDocumentData,
  addDataWithCustomId,
  subcribeListeningCollection,
  subcribeListeningByDocumentId,
} from 'utils/firebase';
import { Button } from 'components';
import { useEffect, useState } from 'react';
export default function gametype() {
  const [currentMove, setCurrentMove] = useState<number>(0);
  const [currentMoves, setCurrentMoves] = useState<{ [id: string]: any }>({});
  const { query } = useRouter();

  const { userAddress } = useWalletContext();

  const playerMoveHandler = async () => {
    const data = { [currentMove]: { sender: userAddress, data: Date.now() } };
    const moves = await getDocumentById(db, 'testchats', query.gameid as string);
    console.log(moves);
    if (!moves) {
      addDataWithCustomId(db, 'testchats', data, query.gameid as string);
    }

    if (moves && query.gameid) {
      updateDocumentData(db, 'testchats', data, query.gameid as string);
    }
    setCurrentMove(currentMove + 1);
  };

  useEffect(() => {
    console.log('get moves');
    if (query.gameid) {
      getDocumentById(db, 'testchats', query.gameid as string).then((moves) => {
        if (!!moves) {
          const movesLength = Object.keys(moves as { [id: string]: any }).length;
          setCurrentMove(movesLength);
          setCurrentMoves(moves!);
        }
      });
    }
  }, [query.gameid]);

  useEffect(() => {
    console.log(currentMoves);

    if (!!currentMoves) {
      setCurrentMove(Object.keys(currentMoves).length);
      console.log(Object.keys(currentMoves).length);
    }
  }, [currentMoves]);

  useEffect(() => {
    if (query.gameid) {
      const unsubscribe = subcribeListeningByDocumentId(
        db,
        'testchats',
        setCurrentMoves,
        query.gameid as string,
      );

      return unsubscribe;
    }
  }, [query.gameid]);

  return (
    <div className={styles.container}>
      <h1>Game</h1>
      <h3>{`game id: ${JSON.stringify(query.gameid)}`}</h3>
      <h3>{`game type: ${JSON.stringify(query.gameType)}`}</h3>
      <h4>Current player: {userAddress} </h4>
      <Button value="Current player move" onClick={playerMoveHandler} />
      {!!currentMoves && (
        <div>
          {Object.keys(currentMoves).map((move) => {
            return (
              <div key={move}>
                {currentMoves[move].sender} {String(currentMoves[move].data)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
