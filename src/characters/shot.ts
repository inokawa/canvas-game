import { Character, Position } from "./base";

export class Shot extends Character {
  speed: number;
  vector: Position;

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
    this.vector = new Position(0.0, -1.0);
  }

  set(x: number, y: number) {
    this.position.set(x, y);
    this.life = 1;
  }

  setVector(x: number, y: number) {
    this.vector.set(x, y);
  }

  update() {
    if (this.life <= 0) return;
    if (this.position.y + this.height < 0) {
      this.life = 0;
    }
    this.position.x += this.vector.x * this.speed;
    this.position.y += this.vector.y * this.speed;
    this.draw();
  }
}
