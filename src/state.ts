import { zeroPadding } from "./utils";

export const initState = (ctx: CanvasRenderingContext2D): State => ({
  ctx,
  gameScore: new GameScore(),
  key: {
    arrowLeft: false,
    arrowRight: false,
    arrowDown: false,
    arrowUp: false,
    z: false,
  },
});

export type State = {
  ctx: CanvasRenderingContext2D;
  gameScore: GameScore;
  key: {
    arrowLeft: boolean;
    arrowRight: boolean;
    arrowUp: boolean;
    arrowDown: boolean;
    z: boolean;
  };
};

class GameScore {
  score: number = 0;

  add(num: number) {
    this.score = Math.min(this.score + num, 99999);
  }

  reset() {
    this.score = 0;
  }

  display() {
    return zeroPadding(this.score, 5);
  }
}
