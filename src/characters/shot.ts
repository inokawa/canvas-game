import { Character, CharacterOpt, Vector } from "./base";
import { Boss, Enemy } from "./enemies";
import { Explosion } from "./explosion";
import { Player } from "./player";
import { State } from "../state";

export class Shot extends Character {
  protected speed: number = 7;
  protected power: number = 1;
  protected targetArray: Character[] = [];
  protected explosionArray: Explosion[] = [];

  constructor(state: State, image: HTMLImageElement, option: CharacterOpt) {
    super(state, image, option);
  }

  set(x: number, y: number, speed: number = 7, power: number = 1) {
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

  hasCollision(t: Character): boolean {
    const dist = this.position.distance(t.position);
    return dist <= (this.width + t.width) / 4;
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
        if (this.hasCollision(t) && !t.isInvincible()) {
          t.life -= this.power;
          if (t.life <= 0) {
            for (const e of this.explosionArray) {
              if (!e.life) {
                e.set(t.position.x, t.position.y);
                break;
              }
            }
            t.destroyed();
          }
          this.life = 0;
        }
      });
    }
    this.rotationDraw();
  }
}

export class Homing extends Shot {
  private frame: number = 0;

  constructor(state: State, image: HTMLImageElement, option: CharacterOpt) {
    super(state, image, option);
  }

  set(x: number, y: number, speed: number, power: number) {
    super.set(x, y, speed, power);
    this.frame = 0;
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
    let target = this.targetArray[0];
    if (this.frame < 100) {
      const normalizedVector = Vector.unit(
        target.position.x - this.position.x,
        target.position.y - this.position.y
      );
      this.vector = Vector.unit(this.vector.x, this.vector.y);
      const cross = this.vector.cross(normalizedVector);
      const rad = Math.PI / 180.0;
      if (cross > 0.0) {
        this.vector.rotate(rad);
      } else if (cross < 0.0) {
        this.vector.rotate(-rad);
      }
    }
    this.position.x += this.vector.x * this.speed;
    this.position.y += this.vector.y * this.speed;

    this.targetArray.forEach((t) => {
      if (this.life <= 0 || t.life <= 0) {
        return;
      }
      let dist = this.position.distance(t.position);
      if (dist <= (this.width + t.width) / 4) {
        if (t instanceof Player) {
          if (t.isComing === true) {
            return;
          }
        }
        t.life -= this.power;
        if (t.life <= 0) {
          for (let i = 0; i < this.explosionArray.length; ++i) {
            if (this.explosionArray[i].life !== true) {
              this.explosionArray[i].set(t.position.x, t.position.y);
              break;
            }
          }
          if (t instanceof Enemy) {
            let score = 100;
            if (t.type === "large") {
              score = 1000;
            }
            this.state.gameScore.add(score);
          }
        }
        this.life = 0;
      }
    });
    this.rotationDraw();
    this.frame++;
  }
}
