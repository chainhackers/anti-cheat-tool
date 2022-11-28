export interface IButtonProps {
  children?: React.ReactNode;
  value?: string;
  onClick?: () => void | Promise<void>;
  type?: 'button' | 'submit';
}
