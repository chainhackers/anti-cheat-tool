import { Logo } from 'components/Logo';
import { PoweredByUnitPropsI } from './PoweredByUnitProps';
import styles from './PoweredByUnit.module.scss';
import Link from 'next/link';

export const PoweredByUnit: React.FC<PoweredByUnitPropsI> = ({ name, image, href }) => {
  return (
    <div className={styles.container}>
      <a href={href} target="_blank" className={styles.link}>
        <Logo image={image} className={styles.logo} />
        <div className={styles.name}>{name}</div>
      </a>
    </div>
  );
};
