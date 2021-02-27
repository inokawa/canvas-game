import { State, Character, Position, CharacterOpt } from "./base";
import { Shot } from "./shot";
import { degToRad } from "../utils";

export class Player extends Character {
  state: State;
  speed: number = 3;

  shotArray: Shot[];
  singleShotArray: Shot[];
  shotCheckCounter = 0;
  shotInterval = 10;

  isComing: boolean = false;
  comingStart?: number;
  comingStartPosition?: Position;
  comingEndPosition?: Position;

  constructor(
    state: State,
    ctx: CanvasRenderingContext2D,
    imagePath: string,
    option: CharacterOpt,
    {
      shot,
      singleShot,
    }: {
      shot: Shot[];
      singleShot: Shot[];
    }
  ) {
    super(ctx, imagePath, option);
    this.state = state;
    this.shotArray = shot;
    this.singleShotArray = singleShot;
  }

  update() {
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
        this.ctx.globalAlpha = 0.5;
      }
    } else {
      if (this.state.isKeyDown.arrowLeft) {
        this.position.x -= this.speed;
      }
      if (this.state.isKeyDown.arrowRight) {
        this.position.x += this.speed;
      }
      if (this.state.isKeyDown.arrowUp) {
        this.position.y -= this.speed;
      }
      if (this.state.isKeyDown.arrowDown) {
        this.position.y += this.speed;
      }
      this.position.set(
        Math.min(Math.max(this.position.x, 0), this.ctx.canvas.width),
        Math.min(Math.max(this.position.y, 0), this.ctx.canvas.height)
      );

      if (this.state.isKeyDown.z) {
        if (this.shotCheckCounter >= 0) {
          for (let i = 0; i < this.shotArray.length; i++) {
            if (this.shotArray[i].life <= 0) {
              this.shotArray[i].set(this.position.x, this.position.y);
              this.shotArray[i].setPower(2);
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
    this.ctx.globalAlpha = 1.0;
  }

  setComing(startX: number, startY: number, endX: number, endY: number) {
    this.isComing = true;
    this.comingStart = Date.now();
    this.position.set(startX, startY);
    this.comingStartPosition = new Position(startX, startY);
    this.comingEndPosition = new Position(endX, endY);
  }
}
