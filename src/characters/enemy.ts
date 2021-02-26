import { Character } from "./base";
import { Shot } from "./shot";

const DEFAULT_ENEMY_TYPE = "default";

export class Enemy extends Character {
  speed: number = 3;
  frame = 0;
  type: string = DEFAULT_ENEMY_TYPE;
  shotArray: Shot[] = [];

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

  set(
    x: number,
    y: number,
    life: number = 1,
    type: string = DEFAULT_ENEMY_TYPE
  ) {
    this.position.set(x, y);
    this.life = life;
    this.type = type;
    this.frame = 0;
  }

  setShotArray(shotArray: Shot[]) {
    this.shotArray = shotArray;
  }

  fire(x: number = 0.0, y: number = 1.0) {
    for (let i = 0; i < this.shotArray.length; i++) {
      if (this.shotArray[i].life <= 0) {
        this.shotArray[i].set(this.position.x, this.position.y);
        this.shotArray[i].setSpeed(5.0);
        this.shotArray[i].setVector(x, y);
        break;
      }
    }
  }

  update() {
    if (this.life <= 0) return;

    switch (this.type) {
      case DEFAULT_ENEMY_TYPE:
        if (this.frame == 50) {
          this.fire();
        }
        if (this.position.y - this.height > this.ctx.canvas.height) {
          this.life = 0;
        }
        this.position.x += this.vector.x * this.speed;
        this.position.y += this.vector.y * this.speed;
        break;
      default:
        break;
    }

    this.draw();
    this.frame++;
  }
}
