import { loadImage } from "../utils";

export type State = {
  key: {
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

  distance(target: Position): number {
    const x = this.x - target.x;
    const y = this.y - target.y;
    return Math.sqrt(x * x + y * y);
  }
}

export class Vector extends Position {
  constructor(x: number, y: number) {
    super(x, y);
  }

  static new(x: number = 0.0, y: number = -1.0): Vector {
    return new Vector(x, y);
  }

  static fromAngle(angle: number): Vector {
    return new Vector(Math.cos(angle), Math.sin(angle));
  }

  get angle(): number {
    const asin = Math.asin(this.y);
    return this.x >= 0 ? asin : Math.PI - asin;
  }

  setAngle(angle: number) {
    this.set(Math.cos(angle), Math.sin(angle));
  }
}

export class ObjectBase {
  update() {}

  ready(): boolean {
    return true;
  }
}

export type CharacterOpt = {
  x?: number;
  y?: number;
  w: number;
  h: number;
  life?: number;
};

export class Character extends ObjectBase {
  ctx: CanvasRenderingContext2D;
  position: Position;
  vector: Vector;
  width: number;
  height: number;
  life: number;
  image?: HTMLImageElement;

  constructor(
    ctx: CanvasRenderingContext2D,
    imagePath: string,
    { x = 0, y = 0, w, h, life = 0 }: CharacterOpt
  ) {
    super();
    this.ctx = ctx;
    this.position = new Position(x, y);
    this.vector = Vector.new();
    this.width = w;
    this.height = h;
    this.life = life;
    (async () => {
      this.image = await loadImage(imagePath);
    })();
  }

  setVector(x: number, y: number) {
    this.vector.set(x, y);
  }

  setVectorFromAngle(angle: number) {
    this.vector.setAngle(angle);
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
    this.ctx.rotate(this.vector.angle - Math.PI * 1.5);

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
