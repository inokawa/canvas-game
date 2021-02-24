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
  comingStartPosition?: Position;
  comingEndPosition?: Position;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    image: HTMLImageElement
  ) {
    super(ctx, x, y, 0, image);
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
    }
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
