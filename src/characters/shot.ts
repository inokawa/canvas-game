import { Character, CharacterOpt } from "./base";
import { Enemy } from "./enemies";
import { Explosion } from "./explosion";
import { Player } from "./player";
import { State } from "../state";

export class Shot extends Character {
  speed: number = 7;
  power: number = 1;
  targetArray: Character[] = [];
  explosionArray: Explosion[] = [];

  constructor(state: State, imagePath: string, option: CharacterOpt) {
    super(state, imagePath, option);
  }

  set(x: number, y: number) {
    this.position.set(x, y);
    this.life = 1;
  }

  setSpeed(speed: number) {
    if (speed <= 0) return;
    this.speed = speed;
  }

  setPower(power: number) {
    if (power <= 0) return;
    this.power = power;
  }

  setTargets(targets: Character[]) {
    this.targetArray = targets;
  }

  setExplosions(explosions: Explosion[]) {
    this.explosionArray = explosions;
  }

  update() {
    if (this.life <= 0) return;
    if (
      this.position.x + this.width < 0 ||
      this.position.x - this.width > this.state.ctx.canvas.width ||
      this.position.y + this.height < 0 ||
      this.position.y - this.height > this.state.ctx.canvas.height
    ) {
      this.life = 0;
    }
    this.position.x += this.vector.x * this.speed;
    this.position.y += this.vector.y * this.speed;

    if (this.life > 0) {
      this.targetArray.forEach((t) => {
        if (t.life <= 0) return;
        const dist = this.position.distance(t.position);
        if (dist <= (this.width + t.width) / 4) {
          if (t instanceof Player && t.isComing) return;
          t.life -= this.power;
          if (t.life <= 0) {
            for (const e of this.explosionArray) {
              if (!e.life) {
                e.set(t.position.x, t.position.y);
                break;
              }
            }
          }
          if (t instanceof Enemy) {
            if (t.type === "large") {
              this.state.gameScore.add(1000);
            } else {
              this.state.gameScore.add(100);
            }
          }

          this.life = 0;
        }
      });
    }
    this.rotationDraw();
  }
}
