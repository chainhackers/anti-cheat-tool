import { Button } from 'components';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from 'styles/JoinGame.module.scss';
const JoinGame = () => {
  const [gameList, setGameList] = useState();
  const { t } = useTranslation();
  const router = useRouter();

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const { value } = event.currentTarget.gameid;
    //TODO: add gameId handler
    console.log(router.query);
    const { gameType } = router.query as { gameType: string };
    router.push(`/games/${gameType}?game=${value}`);
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>{t('joinGame.title')}</h1>
      <div className={styles.description}>{t('joinGame.description')}</div>
      <form className={styles.form} onSubmit={submitHandler}>
        <div className={styles.inputgroup}>
          <input
            id="gameid"
            className={styles.input}
            placeholder="ttt-000"
            autoComplete="off"
            name="gameid"
          ></input>
          <label htmlFor="gameid" className={styles.label}>
            {t('joinGame.gameid')}
          </label>
        </div>
        <Button type="submit" value="submit" width="w200" color="black" />
      </form>
      {gameList && <div className={styles.description}>{t('joinGame.choseFromlist')}</div>}
    </div>
  );
};
export default JoinGame;
