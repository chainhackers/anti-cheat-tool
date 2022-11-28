import { Button } from 'components';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  // app as firebaseApp,
  addData,
  addDataWithCustomId,
  subcribeListeningCollection,
  getDocumentById,
  getAllDocuments,
  // subcribeListeningCollection,
  db,
} from '../../utils/firebase';

import styles from './games.module.scss';

export default function Games() {
  const [dataList, setDataList] = useState<{ [id: string]: string }[]>([]);
  const [dataList2, setDataList2] = useState<any[]>([]);

  const router = useRouter();

  // const db = getFirestore(firebaseApp);

  // const addDataHandler = async () => {
  //   const result = await addDataWithCustomId(
  //     db,
  //     'testgames',
  //     { gameType: 'titititc' },
  //     `ttt-0${Math.floor(Math.random() * 100)}`,
  //   );
  //   console.log('add data result', result);
  // };
  // const addDataHandler2 = async () => {
  //   const result = await addDataWithCustomId(
  //     db,
  //     'testchats',
  //     { gameType: 'titititc' },
  //     `ttt-0${Math.floor(Math.random() * 100)}`,
  //   );
  //   console.log('add data result', result);
  // };

  useEffect(() => {
    const unsubscribe = subcribeListeningCollection(db, 'testgames', setDataList);
    return unsubscribe;
  }, []);

  const clickSelectGameHandler = (type: 'joingame' | 'newgame') => () => {
    router.push(`/testgames/${type}`);
  };

  return (
    <div className={styles.container}>
      <h1>Games</h1>
      <div className={styles.select}>
        <Button value="new game" onClick={clickSelectGameHandler('newgame')}></Button>
        <Button value="join game" onClick={clickSelectGameHandler('joingame')}></Button>
      </div>
    </div>
  );
}
