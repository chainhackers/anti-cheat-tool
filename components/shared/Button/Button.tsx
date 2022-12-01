import cn from 'classnames';
import { IButtonProps } from './ButtonProps';
import styles from './Button.module.scss';
export const Button: React.FC<IButtonProps> = ({
  value = 'button',
  onClick = () => undefined,
  type = 'button',
  width = 'unset',
  color = 'default_color',
  disabled,
  size = 'default',
  borderless,
}) => {
  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    onClick();
  };

  return (
    <div className={styles.container}>
      <button
        type={type}
        className={cn(
          styles.button,
          styles[width],
          styles[color],
          styles[borderless ? 'borderless' : 'default'],
          styles[size],
          styles[disabled ? 'disabled' : 'default'],
          styles.capitalise,
        )}
        onClick={clickHandler}
        // disabled={disabled}
      >
        {value}
      </button>
    </div>
  );
};
