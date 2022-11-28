import { IButtonProps } from './ButtonProps';
import styles from './Button.module.scss';
export const Button: React.FC<IButtonProps> = ({
  value = 'button',
  onClick = () => undefined,
  type = 'button',
}) => {
  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    onClick();
  };
  return (
    <div className={styles.container}>
      <button type={type} className={styles.button} onClick={clickHandler}>
        {value}
      </button>
    </div>
  );
};
