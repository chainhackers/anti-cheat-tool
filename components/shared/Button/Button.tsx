import cn from 'classnames';
import { IButtonProps } from './ButtonProps';
import styles from './Button.module.scss';
export const Button: React.FC<IButtonProps> = ({
  value = 'button',
  onClick = () => undefined,
  type = 'button',
  width = 'unset',
  color = 'default_color',
}) => {
  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    onClick();
  };
  return (
    <div className={styles.container}>
      <button
        type={type}
        className={cn(styles.button, styles[width], styles[color], styles.capitalise)}
        onClick={clickHandler}
      >
        {value}
      </button>
    </div>
  );
};
