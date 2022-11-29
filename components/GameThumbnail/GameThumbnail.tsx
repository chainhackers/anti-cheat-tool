import { GameThumbnailPropsI } from './GameThumbnailProps';
import Image from 'next/image';
import styles from './GameThumbnail.module.scss';
import Link from 'next/link';
export const GameThumbnail: React.FC<GameThumbnailPropsI> = ({ name, image, url }) => {
  return (
    <div className={styles.container}>
      <Link href={url}>
        <div className={styles.image}>
          <Image src={image} layout="fill" alt="game logo" />
        </div>
        <div className={styles.name}>{name}</div>
      </Link>
    </div>
  );
};
