import Image from 'next/image';
import Link from 'next/link';
import cn from 'classnames';
import { ILogoProps } from './LogoProps';
import styles from './Logo.module.scss';
export const Logo: React.FC<ILogoProps> = ({ image, href, className }) => {
  return (
    <div className={cn(styles.container, className)}>
      {href ? (
        <Link href={href} className={cn(styles.link, className)}>
          <Image src={image ? image : ''} width={77} height={77} alt="logo" priority />
        </Link>
      ) : (
        <Image src={image ? image : ''} width={77} height={77} alt="logo" priority />
      )}
    </div>
  );
};
