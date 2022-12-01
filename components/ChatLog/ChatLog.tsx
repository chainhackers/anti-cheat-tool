import { IChatLogProps } from './ChatLogProps';
import styles from './ChatLog.module.scss';
import { IAnyMessage, IChatLogMessage } from 'types';
import { ChatLogElement } from './ChatLogElement';

export const ChatLog: React.FC<IChatLogProps> = ({ anyMessages, isLoading }) => {
  // console.log('LOG anyMessages', anyMessages);
  const filteredMessages: IChatLogMessage[] = [];
  if (!!anyMessages) {
    const { moves } = anyMessages;
    // console.log('LOG moves', moves, Array.isArray(moves));
    if (!!moves) {
      for (const anyMessage of moves) {
        // console.log('LOG antMessage', anyMessage);
        if (anyMessage.messageType == 'ISignedGameMove') {
          filteredMessages.push(anyMessage);
        }
      }
    }
  }

  // console.log('anyMessages', anyMessages);
  // console.log('LOG filteredMessages', filteredMessages);

  function makeElements() {
    return filteredMessages
      .sort((a, b) => {
        return b.nonce - a.nonce;
      })
      .map((anyMessage: IChatLogMessage, index) => {
        return <ChatLogElement key={anyMessage.gameId + index} anyMessage={anyMessage} />;
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
