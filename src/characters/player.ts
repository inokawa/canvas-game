import { Character, Vector, CharacterOpt } from "./base";
import { Shot } from "./shot";
import { degToRad } from "../utils";
import { State } from "../state";

export class Player extends Character {
  private speed: number = 3;

  private shotArray: Shot[];
  private singleShotArray: Shot[];
  private shotCheckCounter = 0;
  private shotInterval = 10;

  isComing: boolean = false;
  private comingStart?: number;
  private comingStartPosition?: Vector;
  private comingEndPosition?: Vector;

  constructor(
    state: State,
    image: HTMLImageElement,
    option: CharacterOpt,
    {
      shot,
      singleShot,
    }: {
      shot: Shot[];
      singleShot: Shot[];
    }
  ) {
    super(state, image, option);
    this.state = state;
    this.shotArray = shot;
    this.singleShotArray = singleShot;
  }

  isInvincible(): boolean {
    return this.isComing;
  }

  update() {
    if (this.life <= 0) return;
    if (
      !this.comingStart ||
      !this.comingStartPosition ||
      !this.comingEndPosition
    ) {
      return;
    }
    const justTime = Date.now();

    if (this.isComing) {
      const comingTime = (justTime - this.comingStart) / 1000;
      let y = this.comingStartPosition.y - comingTime * 50;
      if (y <= this.comingEndPosition.y) {
        this.isComing = false;
        y = this.comingEndPosition.y;
      }

      this.position.set(this.position.x, y);
      if (justTime % 100 < 50) {
        this.state.ctx.globalAlpha = 0.5;
      }
    } else {
      if (this.state.key.arrowLeft) {
        this.position.x -= this.speed;
      }
      if (this.state.key.arrowRight) {
        this.position.x += this.speed;
      }
      if (this.state.key.arrowUp) {
        this.position.y -= this.speed;
      }
      if (this.state.key.arrowDown) {
        this.position.y += this.speed;
      }
      this.position.set(
        Math.min(Math.max(this.position.x, 0), this.state.ctx.canvas.width),
        Math.min(Math.max(this.position.y, 0), this.state.ctx.canvas.height)
      );

      if (this.state.key.z) {
        if (this.shotCheckCounter >= 0) {
          for (const s of this.shotArray) {
            if (s.life <= 0) {
              s.set(this.position.x, this.position.y);
              s.setPower(2);
              this.shotCheckCounter = -this.shotInterval;
              break;
            }
          }
          for (let i = 0; i < this.singleShotArray.length; i += 2) {
            if (
              this.singleShotArray[i].life <= 0 &&
              this.singleShotArray[i + 1].life <= 0
            ) {
              const radCW = degToRad(280);
              const radCCW = degToRad(260);
              this.singleShotArray[i].set(this.position.x, this.position.y);
              this.singleShotArray[i].setVectorFromAngle(radCW);
              this.singleShotArray[i + 1].set(this.position.x, this.position.y);
              this.singleShotArray[i + 1].setVectorFromAngle(radCCW);
              this.shotCheckCounter = -this.shotInterval;
              break;
            }
          }
        }
      }
    }
    this.shotCheckCounter++;

    this.draw();
    this.state.ctx.globalAlpha = 1.0;
  }

  setComing(startX: number, startY: number, endX: number, endY: number) {
    this.life = 1;
    this.isComing = true;
    this.comingStart = Date.now();
    this.position.set(startX, startY);
    this.comingStartPosition = new Vector(startX, startY);
    this.comingEndPosition = new Vector(endX, endY);
  }
}
