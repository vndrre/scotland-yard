export const GameStatus = {
  WAITING: 'WAITING',
  IN_PROGRESS: 'IN_PROGRESS',
  FINISHED: 'FINISHED',
  CANCELLED: 'CANCELLED'
} as const;

export const PlayerRole = {
  MR_X: 'MR_X',
  DETECTIVE: 'DETECTIVE'
} as const;

export const PlayerColor = {
  RED: 'RED',
  YELLOW: 'YELLOW',
  GREEN: 'GREEN',
  BLUE: 'BLUE',
  BLACK: 'BLACK'
} as const;

export const TransportType = {
  TAXI: 'TAXI',
  BUS: 'BUS',
  UNDERGROUND: 'UNDERGROUND',
  BLACK: 'BLACK',
  FERRY: 'FERRY'
} as const;

export type GameStatus = typeof GameStatus[keyof typeof GameStatus];
export type PlayerRole = typeof PlayerRole[keyof typeof PlayerRole];
export type PlayerColor = typeof PlayerColor[keyof typeof PlayerColor];
export type TransportType = typeof TransportType[keyof typeof TransportType];

//Import in other files like this: import { GameStatus, PlayerRole, PlayerColor, TransportType } from '../types/game';