import { ethers } from "ethers";

type TGameFinished = { gameId: number; winner: string; loser: string; isDraw: boolean };
type TPlayerDisqualified = { gameId: number; player: string };
type TPlayerResigned = { gameId: number; player: string };

export function getSigner(): ethers.Signer {
  const provider = new ethers.providers.Web3Provider(
    window.ethereum as ethers.providers.ExternalProvider,
  );
  const signer = provider.getSigner();
  return signer;
}

export class FinishedGameState {
  gameId: number;
  winner: string | null;
  loser: string | null;
  isDraw: boolean;
  disqualified: string | null;
  resigned: string | null;

  constructor(
    gameId: number,
    winner: string | null = null,
    loser: string | null = null,
    isDraw: boolean,
    disqualified: string | null = null,
    resigned: string | null = null,
  ) {
    this.gameId = gameId;
    this.winner = winner;
    this.loser = loser;
    this.isDraw = isDraw;
    this.disqualified = disqualified;
    this.resigned = resigned;
  }
  static fromGameFinishedArgs(gameFinished: TGameFinished) {
    return new FinishedGameState(
      gameFinished.gameId,
      gameFinished.winner,
      gameFinished.loser,
      gameFinished.isDraw,
    );
  }
  addPlayerDisqualified(playerDisqualified: TPlayerDisqualified) {
    this.gameId = playerDisqualified.gameId;
    this.disqualified = playerDisqualified.player;
    return this;
  }
  addPlayerResigned(playerResigned: TPlayerResigned) {
    this.gameId = playerResigned.gameId;
    this.resigned = playerResigned.player;
    return this;
  }
}
