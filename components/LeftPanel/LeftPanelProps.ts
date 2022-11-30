import { PlayerI } from 'types/games';

export interface LeftPanelPropsI {
  children?: React.ReactNode;
  players: PlayerI[];
  isTimeoutAllowed: boolean;
  initTimeout: () => Promise<void>;
  isResolveTimeoutAllowed: boolean;
  resolveTimeout: () => Promise<void>;
  finishTimeout: () => Promise<void>;
  isFinishTimeOutAllowed: boolean;
  isTimeoutRequested: boolean;
  isDisputAvailable?: boolean;
  onRunDisput: () => Promise<void>;
}
