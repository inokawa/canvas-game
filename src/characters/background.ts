import { State } from "../state";
import { ObjectBase, Position } from "./base";

export class BackgroundStar extends ObjectBase {
  state: State;
  size: number;
  speed: number;
  color: string;
  position: Position = new Position(0, 0);

  constructor(state: State, size: number, speed: number, color = "#ffffff") {
    super();
    this.state = state;
    this.size = size;
    this.speed = speed;
    this.color = color;
  }

  set(x: number, y: number) {
    this.position.set(x, y);
  }

  update() {
    this.state.ctx.fillStyle = this.color;
    this.position.y += this.speed;
    this.state.ctx.fillRect(
      this.position.x - this.size / 2,
      this.position.y - this.size / 2,
      this.size,
      this.size
    );
    if (this.position.y + this.size > this.state.ctx.canvas.height) {
      this.position.y = -this.size;
    }
  }
}
