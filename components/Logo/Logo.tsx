import Image from 'next/image';
import Link from 'next/link';
import { ILogoProps } from './LogoProps';
import styles from './Logo.module.scss';
export const Logo: React.FC<ILogoProps> = ({ image, href }) => {
  console.log('image', image);
  return (
    <div className={styles.container}>
      {href ? (
        <Link href={href} className={styles.link}>
          <Image src={image ? image : ''} width={77} height={77} alt="logo" />
        </Link>
      ) : (
        <Image src={image ? image : ''} width={77} height={77} alt="logo" />
      )}
    </div>
  );
};
