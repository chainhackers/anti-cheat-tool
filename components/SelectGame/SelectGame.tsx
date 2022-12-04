import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import empty_avatar from 'public/images/empty_avatar.png';
import { SelectGamePropsI } from './SelectGameProps';
import styles from './SelectGame.module.scss';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import gameApi from 'gameApi';
import { useWalletContext } from 'contexts/WalltetContext';
import {
  db,
  addDataWithCustomId,
  getCollectionSize,
  getDocumentById,
  updateDocumentData,
} from 'utils';

// const arbiterContractAddress = 'KT1UZzu4ar6STUj2Mxde2hKH8LncCmY2vfjt';
const arbiterContractAddress = 'KT1UhzvTeMbc3jcSCMjvosicfGAhbQBfQDZP';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const SelectGame: React.FC<SelectGamePropsI> = ({
  userName,
  gameType,
  // onProposeGame,
  // arbiterContractData,
  // gameRulesContractData,
}) => {
  // const [isCreatingNewGame, setCreatingNewGame] = useState<boolean>(false);
  // const [creatingGameError, setCreatingGameError] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useTranslation();
  const { userAddress, isConnected, connectWallet, tezos } = useWalletContext();
  const [newGameId, setNewGameId] = useState<number | null>(null);
  const [creatingGame, setCreatingGame] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isConnected) {
      connectWallet();
    }
  }, []);

  const proposeGameHandler = async () => {
    try {
      setNewGameId(null);
      setCreatingGame(true);
      if (!userAddress) throw new Error('no user address');
      const contract = await tezos.wallet.at(arbiterContractAddress);

      const op = await contract.methods.proposeGame(arbiterContractAddress).send();
      // console.log(op);
      const confirmation = await op.confirmation(1);

      console.log('cofirmation', confirmation);

      const gamesCollectionSize = await getCollectionSize(db, 'testgames');
      const newGameId = gamesCollectionSize + 1;
      await addDataWithCustomId(
        db,
        'testgames',
        {
          proposer: userAddress,
          acceptor: ZERO_ADDRESS,
          gameId: newGameId,
          tameRules: 'tic-tac-toe',
          txHash: op.opHash,
        },
        newGameId,
      );
      setNewGameId(newGameId);
      router.push('/games/' + gameType + `?game=${newGameId}`);
      setCreatingGame(null);
    } catch (error) {
      console.error(error);
      setCreatingGame(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>{t('selectGame.title')}</div>
      <div className={styles.description}>{t('selectGame.description')}</div>
      <div className={styles.avatar}>
        <Image src={empty_avatar} alt={'avatat'} width="61px" height="61px"></Image>
      </div>
      <div className={styles.userName}>
        {userAddress ? userAddress : t('selectGame.unknownUser')}
      </div>
      {creatingGame !== null && (
        <p style={{ fontSize: '4rem' }}>
          {creatingGame ? 'Creating new game...' : 'Failed to create new game'}
        </p>
      )}
      {
        <div className={styles.selection}>
          <div className={styles.new}>
            <div className={styles.title}>{t('selectGame.new.title')}</div>
            <div className={styles.description}>{t('selectGame.new.description')}</div>
            {/* <Link href={'/games/' + gameType + '?prize=true'}> */}
            {/* <a> */}
            <div className={styles.button} onClick={proposeGameHandler}>
              {t('selectGame.new.button')}
            </div>
            {/* </a> */}
            {/* </Link> */}
          </div>
          <div className={styles.join}>
            <div className={styles.title}>{t('selectGame.join.title')}</div>
            <div className={styles.description}>{t('selectGame.join.description')}</div>
            <Link href={'/games/' + gameType + '?join=true'}>
              <a>
                <div className={styles.button}>{t('selectGame.join.button')}</div>
              </a>
            </Link>
          </div>
        </div>
      }
      {/* {creatingGameError && <div className={styles.error}>{creatingGameError}</div>} */}
      {/* {isCreatingNewGame && <div className={styles.newGameLoader}>Creating new game...</div>} */}
    </div>
  );
};
