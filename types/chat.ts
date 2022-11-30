import { FinishedGameState } from 'gameApi';
import { TGameType } from 'types/games';
import { ISignedGameMove } from './arbiter';

export type TMessageType =
  | ISignedGameMove
  // | GameProposedEventObject
  // | GameStartedEventObject
  // | GameFinishedEventObject
  // | TimeoutStartedEventObject
  // | TimeoutResolvedEventObject
  | FinishedGameState;

export interface IGameMessage {
  gameType: TGameType;
  gameId: number;
  messageType:
    | 'ISignedGameMove'
    | 'GameProposedEvent'
    | 'GameStartedEvent'
    | 'GameFinishedEvent'
    | 'TimeoutStartedEvent'
    | 'TimeoutResolvedEvent'
    | 'FinishedGameState';
  message: TMessageType;
}

export interface IAnyMessage extends IGameMessage {
  underlyingMessage: any;
}
