import { Character } from "./base";

export class Shot extends Character {
  speed: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    imagePath: string
  ) {
    super(ctx, x, y, w, h, 0, imagePath);
    this.speed = 7;
  }

  set(x: number, y: number) {
    this.position.set(x, y);
    this.life = 1;
  }

  update() {
    if (this.life <= 0) return;
    if (this.position.y + this.height < 0) {
      this.life = 0;
    }
    this.position.y -= this.speed;
    this.draw();
  }
}
