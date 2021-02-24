export class Character {
  ctx: CanvasRenderingContext2D;
  position: Position;
  life: number;
  image: HTMLImageElement;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    life: number,
    image: HTMLImageElement
  ) {
    this.ctx = ctx;
    this.position = new Position(x, y);
    this.life = life;
    this.image = image;
  }

  draw() {
    this.ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}

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

export class Player extends Character {
  isComing: boolean = false;
  comingStart?: number;
  comingEndPosition?: Position;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    image: HTMLImageElement
  ) {
    super(ctx, x, y, 0, image);
  }

  setComing(startX: number, startY: number, endX: number, endY: number) {
    this.isComing = true;
    this.comingStart = Date.now();
    this.position.set(startX, startY);
    this.comingEndPosition = new Position(endX, endY);
  }
}
