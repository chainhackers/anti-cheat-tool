export interface IButtonProps {
  children?: React.ReactNode;
  value?: string;
  onClick?: () => void | Promise<void>;
  type?: 'button' | 'submit';
  width?: 'w200' | 'w100p';
  color?: 'black' | 'red';
  size?: 'sm';
  borderless?: boolean;
  disabled?: boolean;
  title?: string;
}
