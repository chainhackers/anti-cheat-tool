import Image from 'next/image';
import Blockies from 'react-blockies';
import empty_avatar from 'public/images/empty_avatar.png';
import { PlayerPropsI } from './PlayerProps';
import styles from './Player.module.scss';
export const Player: React.FC<PlayerPropsI> = ({
  playerName,
  address,
  playerType,
  avatarUrl,
  moves,
}) => {
  const truncatedAddress = address ? address.slice(0, 5) + '...' + address.slice(-5) : null;
  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        {address ? (
          <Blockies seed={!!address ? address : '0x00000000000'} size={10} />
        ) : (
          <Image src={empty_avatar} alt="avatar" width="33" height="33"></Image>
        )}
      </div>
      {address ? (
        <div className={styles.playerData}>
          <div className={styles.name}>
            {playerName}&nbsp;{moves && <span className={styles.move}>move</span>}
          </div>
          <div className={styles.address}>{truncatedAddress}</div>
        </div>
      ) : (
        <div className={styles.playerData}>Waiting...</div>
      )}

      <div className={styles.playerType}>{playerType}</div>
    </div>
  );
};
