import { Character, CharacterOpt, Vector } from "./base";
import { Homing, Shot } from "./shot";
import { State } from "../state";

type EnemyType = "default" | "wave" | "large";

export class Enemy extends Character {
  speed: number = 3;
  frame = 0;
  type: EnemyType = "default";
  attackTarget: Character;
  shotArray: Shot[];

  constructor(
    state: State,
    image: HTMLImageElement,
    option: CharacterOpt,
    target: Character,
    shots: Shot[]
  ) {
    super(state, image, option);
    this.attackTarget = target;
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

  destroyed() {
    if (this.type === "large") {
      this.state.gameScore.add(1000);
    } else {
      this.state.gameScore.add(100);
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
          const tx = this.attackTarget.position.x - this.position.x;
          const ty = this.attackTarget.position.y - this.position.y;
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

type BossMode = "invade" | "escape" | "floating" | "";

export class Boss extends Enemy {
  mode: BossMode;
  frame: number;
  speed: number;
  homingArray: Shot[];

  constructor(
    state: State,
    image: HTMLImageElement,
    option: CharacterOpt,
    target: Character,
    shots: Shot[],
    homingShots: Homing[]
  ) {
    super(state, image, option, target, shots);
    this.mode = "";
    this.frame = 0;
    this.speed = 3;
    this.homingArray = homingShots;
  }

  setMode(mode: BossMode) {
    this.mode = mode;
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

  homingFire(x: number = 0.0, y: number = 1.0, speed: number = 3.0) {
    for (const s of this.homingArray) {
      if (s.life <= 0) {
        s.set(this.position.x, this.position.y);
        s.setSpeed(speed);
        s.setVector(x, y);
        break;
      }
    }
  }

  destroyed() {
    this.state.gameScore.add(15000);
  }

  update() {
    if (this.life <= 0) return;

    switch (this.mode) {
      case "invade":
        this.position.y += this.speed;
        if (this.position.y > 100) {
          this.position.y = 100;
          this.mode = "floating";
          this.frame = 0;
        }
        break;
      case "escape":
        this.position.y -= this.speed;
        if (this.position.y < -this.height) {
          this.life = 0;
        }
        break;
      case "floating":
        if (this.frame % 1000 < 500) {
          if (this.frame % 200 > 140 && this.frame % 10 === 0) {
            const tx = this.attackTarget.position.x - this.position.x;
            const ty = this.attackTarget.position.y - this.position.y;
            const tv = Vector.unit(tx, ty);
            this.fire(tv.x, tv.y, 3.0);
          }
        } else {
          if (this.frame % 50 === 0) {
            this.homingFire(0, 1, 3.5);
          }
        }
        this.position.x += Math.cos(this.frame / 100) * 2.0;
        break;
      default:
        break;
    }

    this.draw();
    this.frame++;
  }
}
