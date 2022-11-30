import { IChatLogProps } from './ChatLogProps';
import styles from './ChatLog.module.scss';
import { IAnyMessage } from 'types';
import { ChatLogElement } from './ChatLogElement';
export const ChatLog: React.FC<IChatLogProps> = ({ anyMessages, isLoading }) => {
  console.log(anyMessages);
  let filteredMessages: IAnyMessage[] = [];
  for (const anyMessage of anyMessages) {
    if (anyMessage.messageType == 'ISignedGameMove') {
      filteredMessages.push(anyMessage);
    }
  }

  console.log('anyMessages', anyMessages);
  console.log('filteredMessages', filteredMessages);

  function makeElements() {
    return filteredMessages.map((anyMessage: IAnyMessage) => {
      return <ChatLogElement key={anyMessage.underlyingMessage.id} anyMessage={anyMessage} />;
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>ChatLog</div>
      <div className={styles.loader}>{`Status: ${
        filteredMessages.length === 0 ? 'Waiting...' : isLoading ? 'Fetching...' : 'Ready'
      }`}</div>
      <div className={styles.log}>{makeElements()}</div>
    </div>
  );
};
