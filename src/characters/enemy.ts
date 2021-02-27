import { Character, CharacterOpt, State } from "./base";
import { Shot } from "./shot";

const DEFAULT_ENEMY_TYPE = "default";

export class Enemy extends Character {
  speed: number = 3;
  frame = 0;
  type: string = DEFAULT_ENEMY_TYPE;
  shotArray: Shot[];

  constructor(
    state: State,
    imagePath: string,
    option: CharacterOpt,
    shots: Shot[]
  ) {
    super(state, imagePath, option);
    this.shotArray = shots;
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

  fire(x: number = 0.0, y: number = 1.0) {
    for (const s of this.shotArray) {
      if (s.life <= 0) {
        s.set(this.position.x, this.position.y);
        s.setSpeed(5.0);
        s.setVector(x, y);
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
        if (this.position.y - this.height > this.state.ctx.canvas.height) {
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
