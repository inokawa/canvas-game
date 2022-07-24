import { ObjectBase, Vector } from "./base";
import { array, easeOut } from "../utils";

type Fire = {
  position: Vector;
  vector: Vector;
  size: number;
};

export class Explosion extends ObjectBase {
  private ctx: CanvasRenderingContext2D;
  life: boolean = false;
  private radius: number;
  private count: number;
  private size: number;
  private fires: Fire[] = [];
  private startTime = 0;
  private timeRange: number;
  private color: string;

  constructor(
    ctx: CanvasRenderingContext2D,
    radius: number,
    count: number,
    size: number,
    timeRange: number,
    color: string = "#ff1166"
  ) {
    super();
    this.ctx = ctx;
    this.radius = radius;
    this.count = count;
    this.size = size;
    this.timeRange = timeRange;
    this.color = color;
  }

  set(x: number, y: number) {
    this.fires = array(this.count, () => ({
      position: new Vector(x, y),
      vector: Vector.fromAngle(Math.random() * Math.PI * 2.0),
      size: (Math.random() * 0.5 + 0.5) * this.size,
    }));
    this.life = true;
    this.startTime = Date.now();
  }

  update() {
    if (!this.life) return;
    this.ctx.fillStyle = this.color;
    this.ctx.globalAlpha = 0.5;

    const time = (Date.now() - this.startTime) / 1000;
    const ease = easeOut(Math.min(time / this.timeRange, 1.0));
    const progress = 1.0 - ease;
    const s = 1.0 - progress;
    for (const f of this.fires) {
      const d = this.radius * progress;
      const x = f.position.x + f.vector.x * d;
      const y = f.position.y + f.vector.y * d;
      this.ctx.fillRect(
        x - (f.size * s) / 2,
        y - (f.size * s) / 2,
        f.size * s,
        f.size * s
      );
    }

    if (progress >= 1.0) {
      this.life = false;
    }
  }
}
