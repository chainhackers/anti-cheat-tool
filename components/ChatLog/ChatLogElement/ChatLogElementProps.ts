import { IAnyMessage, IChatLogMessage } from 'types';


export interface IChatLogElementProps {
  anyMessage: IChatLogMessage;
  children?: React.ReactNode;
}
