import { Button } from 'components';
import { useRouter } from 'next/router';
import { getCollectionSize, db, addDataWithCustomId } from '../../../utils/firebase';
import styles from './newgame.module.scss';

export default function JoinGame() {
  const router = useRouter();

  const createNewGameHandler = async () => {
    const gamesCount = await getCollectionSize(db, 'testgames');
    const newGame = {
      started: false,
      finished: false,
      playersArray: ['0x00', '0x00'],
      rules: 'tzxytttttttttttttt',
    };

    const result = await addDataWithCustomId(
      db,
      'testgames',
      newGame,
      `ttt-${gamesCount + 1}`,
    );

    if (result.documentId) router.push(`/testgames/tic-tac-toe?gameid=${result.documentId}`);
  };
  return (
    <div className={styles.container}>
      <Button value="Create new game" onClick={createNewGameHandler} />
    </div>
  );
}
