import { useTranslation } from 'react-i18next';
import { ActualGamesList, Button } from 'components';
import { useQuery } from '@apollo/client';
import { gameEntitiesQuery } from 'queries';
import { JoinGamePropsI } from './JoinGameProps';
import styles from './JoinGame.module.scss';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { getRulesContract } from '../../gameApi';
import { TGameType } from 'types/game';
import { db, getDocumentById, updateDocumentData } from 'utils';
import { useWalletContext } from 'contexts/WalltetContext';
// import { userAgent } from 'next/server';

const arbiterContractAddress = 'KT1UZzu4ar6STUj2Mxde2hKH8LncCmY2vfjt';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const JoinGame: React.FC<JoinGamePropsI> = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { userAddress, tezos } = useWalletContext();

  const gameType = router.query.gameType as TGameType;
  const { data, error, loading } = useQuery(gameEntitiesQuery, {
    variables: { rules: getRulesContract(gameType).address },
  });

  const [isAccepting, setAccepting] = useState<boolean>(false);
  const [acceptingError, setAcceptingError] = useState<string | null>(null);

  const gameEntities = data?.gameEntities as { started: boolean | null; rules: string }[];

  const dataToShow = !!gameEntities ? gameEntities : [];

  // const clickHandler = async (gameId: string, stake: string) => {
  //   setAcceptingError(null);
  //   setAccepting(true);
  //   acceptGameHandler(parseInt(gameId), stake)
  //     .then(() => {
  //       router.push(`/games/${router.query.gameType}?game=${gameId}`);
  //     })
  //     .catch((error) => {
  //       setAcceptingError(t('joinGame.error'));
  //       console.error('Accepting game failed', error);
  //     })
  //     .finally(() => {
  //       setAccepting(false);
  //     });
  // };

  // const [gameIdToAccept, setGameIdToAccpet] = useState<string | null>(null);
  const [gameAccepted, setGameAccepted] = useState<boolean | null>(null);
  const [joiningGame, setJoiningGame] = useState<boolean | null>(null);

  const acceptGameHandler = async (gameIdToAccept: string) => {
    console.log(gameIdToAccept);
    setJoiningGame(true);
    setGameAccepted(null);
    try {
      if (!gameIdToAccept || Number.isNaN(Number(gameIdToAccept)))
        throw new Error('game id not a number');
      const game = await getDocumentById(db, 'testgames', String(gameIdToAccept));
      // console.log(game);
      if (!game) throw new Error(`game with id=${gameIdToAccept} doesn't exist`);
      console.log('userAdder', userAddress, game.proposer);
      if (game.acceptor !== ZERO_ADDRESS || game.proposer === userAddress)
        throw new Error('Cant accept game: accpeted before or your are the proposer');

      const contract = await tezos.wallet.at(arbiterContractAddress);

      const op = await contract.methods.acceptGame(gameIdToAccept).send();
      console.log(op);
      const confirmation = await op.confirmation(1);
      console.log(confirmation);
      const gameUpdateData = { ...game, acceptor: userAddress, txAcceptHash: op.opHash };

      await updateDocumentData(db, 'testgames', gameUpdateData, String(gameIdToAccept));
      setGameAccepted(true);
      const { gameType } = router.query as { gameType: string };

      router.push(`/games/${gameType}?game=${gameIdToAccept}`);
    } catch (error) {
      console.error(error);
      setGameAccepted(false);
    } finally {
      setJoiningGame(null);
    }
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const { value } = event.currentTarget.gameid;
    //TO: add gameId handler
    // console.log(router.query);

    acceptGameHandler(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>{t('joinGame.title')}</div>
      <form className={styles.form} onSubmit={submitHandler}>
        <div className={styles.inputgroup}>
          <input
            id="gameid"
            className={styles.input}
            placeholder="-"
            autoComplete="off"
            name="gameid"
          ></input>
          <label htmlFor="gameid" className={styles.label}>
            {'game id'}
          </label>
        </div>
        <Button type="submit" value="submit" width="w200" color="black" />
      </form>
      {joiningGame !== null && (
        <p style={{ fontSize: '2rem', marginLeft: '2rem' }}>
          {`Game ${joiningGame ? 'Joining game...' : 'Game not joined'}`}
        </p>
      )}
      {gameAccepted !== null && (
        <p style={{ fontSize: '2rem', marginLeft: '2rem' }}>
          {`Game ${gameAccepted ? 'accepted' : 'not accepted'}`}
        </p>
      )}
    </div>
  );
};
