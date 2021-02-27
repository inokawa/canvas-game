import { Character, CharacterOpt } from "./base";

export class Shot extends Character {
  speed: number = 7;
  power: number = 1;
  targetArray: Character[] = [];

  constructor(
    ctx: CanvasRenderingContext2D,
    imagePath: string,
    option: CharacterOpt
  ) {
    super(ctx, imagePath, option);
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

  update() {
    if (this.life <= 0) return;
    if (
      this.position.y + this.height < 0 ||
      this.position.y - this.height > this.ctx.canvas.height
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
          t.life -= this.power;
          this.life = 0;
        }
      });
    }
    this.rotationDraw();
  }
}
