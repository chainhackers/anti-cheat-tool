import { Button } from 'components';
import { useState } from 'react';
import { getDocumentById, db } from '../../../utils/firebase';
import styles from './joingame.module.scss';
import { useRouter } from 'next/router';
export default function JoinGame() {
  const [gameIdValue, setGameIdValue] = useState<string>('');
  const [gameIdError, setGameIdError] = useState<boolean>(false);

  const router = useRouter();

  const onChangeInpurHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setGameIdValue(event.target.value);
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const game = await getDocumentById(db, 'testgames', gameIdValue);
    if (!!game) router.push(`/testgames/tic-tac-toe?gameid=${gameIdValue}`);
    if (!game) setGameIdError(true);
  };
  return (
    <div className={styles.container}>
      <h1>Join Game</h1>
      <div>
        <form onSubmit={submitHandler}>
          <input value={gameIdValue} onChange={onChangeInpurHandler}></input>
          <Button type={'submit'} value="submit game id" />
        </form>
        {gameIdError && <div className={styles.error}>Game id doesn't exist</div>}
      </div>
    </div>
  );
}
