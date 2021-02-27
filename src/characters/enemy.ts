import { Character, CharacterOpt, Vector } from "./base";
import { Shot } from "./shot";
import { State } from "../state";

type EnemyType = "default" | "wave" | "large";

export class Enemy extends Character {
  speed: number = 3;
  frame = 0;
  type: EnemyType = "default";
  attactTarget: Character;
  shotArray: Shot[];

  constructor(
    state: State,
    imagePath: string,
    option: CharacterOpt,
    target: Character,
    shots: Shot[]
  ) {
    super(state, imagePath, option);
    this.attactTarget = target;
    this.shotArray = shots;
  }

  set(x: number, y: number, life: number = 1, type: EnemyType = "default") {
    this.position.set(x, y);
    this.life = life;
    this.type = type;
    this.frame = 0;
  }

  fire(x: number = 0.0, y: number = 1.0, speed: number = 5.0) {
    for (const s of this.shotArray) {
      if (s.life <= 0) {
        s.set(this.position.x, this.position.y);
        s.setSpeed(speed);
        s.setVector(x, y);
        break;
      }
    }
  }

  update() {
    if (this.life <= 0) return;

    switch (this.type) {
      case "default":
        if (this.frame == 100) {
          this.fire();
        }
        this.position.x += this.vector.x * this.speed;
        this.position.y += this.vector.y * this.speed;
        break;
      case "wave":
        if (this.frame % 60 === 0) {
          const tx = this.attactTarget.position.x - this.position.x;
          const ty = this.attactTarget.position.y - this.position.y;
          const tv = Vector.unit(tx, ty);
          this.fire(tv.x, tv.y, 4.0);
        }
        this.position.x += Math.sin(this.frame / 10);
        this.position.y += 2.0;
        break;
      case "large":
        if (this.frame % 50 === 0) {
          for (let i = 0; i < 360; i += 45) {
            const r = (i * Math.PI) / 180;
            this.fire(Math.cos(r), Math.sin(r), 3.0);
          }
        }
        this.position.x += Math.sin((this.frame + 90) / 50) * 2.0;
        this.position.y += 1.0;
        break;
      default:
        break;
    }
    if (this.position.y - this.height > this.state.ctx.canvas.height) {
      this.life = 0;
    }

    this.draw();
    this.frame++;
  }
}
