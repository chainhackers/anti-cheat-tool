import React from 'react';
import { IAnyMessage, IGameMessage, IChatLogMessage } from 'types';

// interface IChatLogMessage {
//   gameId: string;
//   messageType: 'ISignedGameMove' | string;
//   gameType: string;
//   nonce: number;
//   signedMove: {
//     signatures: string[];
//     gameMove: {
//       gameId: string;
//       nonce: number;
//       player: string;
//       oldState: any;
//       newState: any;
//       move: string;
//     };
//   };
// }

export interface IChatLogProps {
  children?: React.ReactNode;
  anyMessages: { moves: IChatLogMessage[] } | null;
  isLoading?: boolean;
}
