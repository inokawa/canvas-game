import { Character } from "./base";

export class Enemy extends Character {
  speed: number = 3;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    imagePath: string
  ) {
    super(ctx, x, y, w, h, imagePath, 0);
  }

  set(x: number, y: number, life: number = 1) {
    this.position.set(x, y);
    this.life = life;
  }

  update() {
    if (this.life <= 0) return;
    if (this.position.y - this.height > this.ctx.canvas.height) {
      this.life = 0;
    }
    this.position.x += this.vector.x * this.speed;
    this.position.y += this.vector.y * this.speed;

    this.draw();
  }
}
