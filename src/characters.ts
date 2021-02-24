export type State = {
  isKeyDown: {
    arrowLeft: boolean;
    arrowRight: boolean;
    arrowUp: boolean;
    arrowDown: boolean;
  };
};

export class Character {
  ctx: CanvasRenderingContext2D;
  position: Position;
  width: number;
  height: number;
  life: number;
  image: HTMLImageElement;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    life: number,
    image: HTMLImageElement
  ) {
    this.ctx = ctx;
    this.position = new Position(x, y);
    this.width = w;
    this.height = h;
    this.life = life;
    this.image = image;
  }

  draw() {
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
  state: State;
  speed: number = 3;
  isComing: boolean = false;
  comingStart?: number;
  comingStartPosition?: Position;
  comingEndPosition?: Position;

  constructor(
    state: State,
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    image: HTMLImageElement
  ) {
    super(ctx, x, y, w, h, 0, image);
    this.state = state;
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
