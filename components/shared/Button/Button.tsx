import { IButtonProps } from './ButtonProps';
import styles from './Button.module.scss';
export const Button: React.FC<IButtonProps> = ({ value = 'button', onClick }) => {
  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    onClick();
  };
  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={clickHandler}>
        {value}
      </button>
    </div>
  );
};
