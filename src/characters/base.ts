import { loadImage, degToRad } from "../utils";

export type State = {
  isKeyDown: {
    arrowLeft: boolean;
    arrowRight: boolean;
    arrowUp: boolean;
    arrowDown: boolean;
    z: boolean;
  };
};

export class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class Character {
  ctx: CanvasRenderingContext2D;
  position: Position;
  angle: number;
  vector: Position;
  width: number;
  height: number;
  life: number;
  image?: HTMLImageElement;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    life: number,
    imagePath: string
  ) {
    this.ctx = ctx;
    this.position = new Position(x, y);
    this.vector = new Position(0.0, -1.0);
    this.width = w;
    this.height = h;
    this.angle = degToRad(270);
    this.life = life;
    (async () => {
      this.image = await loadImage(imagePath);
    })();
  }

  setVector(x: number, y: number) {
    this.vector.set(x, y);
  }

  setVectorFromAngle(angle: number) {
    this.angle = angle;
    this.vector.set(Math.cos(angle), Math.sin(angle));
  }

  draw() {
    if (!this.image) return;
    const offsetX = this.width / 2;
    const offsetY = this.height / 2;
    this.ctx.drawImage(
      this.image,
      this.position.x - offsetX,
      this.position.y - offsetY,
      this.width,
      this.height
    );
  }

  rotationDraw() {
    if (!this.image) return;
    this.ctx.save();
    this.ctx.translate(this.position.x, this.position.y);
    this.ctx.rotate(this.angle - Math.PI * 1.5);

    const offsetX = this.width / 2;
    const offsetY = this.height / 2;
    this.ctx.drawImage(this.image, -offsetX, -offsetY, this.width, this.height);

    this.ctx.restore();
  }

  update() {}

  ready(): boolean {
    return !!this.image;
  }
}
