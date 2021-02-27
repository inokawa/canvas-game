import { Position, Vector } from "./base";
import { array } from "../utils";

type Fire = {
  position: Position;
  vector: Vector;
};

export class Explosion {
  ctx: CanvasRenderingContext2D;
  life: boolean = false;
  radius: number;
  count: number;
  size: number;
  fires: Fire[] = [];
  startTime = 0;
  timeRange: number;
  color: string;

  constructor(
    ctx: CanvasRenderingContext2D,
    radius: number,
    count: number,
    size: number,
    timeRange: number,
    color: string = "#ff1166"
  ) {
    this.ctx = ctx;
    this.radius = radius;
    this.count = count;
    this.size = size;
    this.timeRange = timeRange;
    this.color = color;
  }

  set(x: number, y: number) {
    this.fires = array(this.count, () => ({
      position: new Position(x, y),
      vector: Vector.fromAngle(Math.random() * Math.PI * 2.0),
    }));
    this.life = true;
    this.startTime = Date.now();
  }

  update() {
    if (!this.life) return;
    this.ctx.fillStyle = this.color;
    this.ctx.globalAlpha = 0.5;

    const time = (Date.now() - this.startTime) / 1000;
    const progress = Math.min(time / this.timeRange, 1.0);
    for (const f of this.fires) {
      const d = this.radius * progress;
      const x = f.position.x + f.vector.x * d;
      const y = f.position.y + f.vector.y * d;
      this.ctx.fillRect(
        x - this.size / 2,
        y - this.size / 2,
        this.size,
        this.size
      );
    }

    if (progress >= 1.0) {
      this.life = false;
    }
  }
}
