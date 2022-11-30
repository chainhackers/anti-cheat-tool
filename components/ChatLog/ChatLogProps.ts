import React from 'react';
import { IAnyMessage, IGameMessage } from 'types';

export interface IChatLogProps {
  children?: React.ReactNode;
  anyMessages: IAnyMessage[];
  isLoading?: boolean;
}
