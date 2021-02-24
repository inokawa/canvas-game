import { loadImage } from "../utils";

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
    this.width = w;
    this.height = h;
    this.life = life;
    (async () => {
      this.image = await loadImage(imagePath);
    })();
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
}
