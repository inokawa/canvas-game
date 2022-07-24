import { State } from "../state";
import { dot } from "../utils";

export class Vector {
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

  static new(x: number = 0.0, y: number = -1.0): Vector {
    return new Vector(x, y);
  }

  static unit(x: number, y: number): Vector {
    const len = this.dot(x, y);
    return new Vector(x / len, y / len);
  }

  static fromAngle(angle: number): Vector {
    return new Vector(Math.cos(angle), Math.sin(angle));
  }

  static dot(x: number, y: number): number {
    return dot(x, y);
  }

  get angle(): number {
    const asin = Math.asin(this.y);
    return this.x >= 0 ? asin : Math.PI - asin;
  }

  setAngle(angle: number) {
    this.set(Math.cos(angle), Math.sin(angle));
  }

  distance(target: Vector): number {
    const x = this.x - target.x;
    const y = this.y - target.y;
    return Vector.dot(x, y);
  }

  cross(target: Vector): number {
    return this.x * target.y - this.y * target.x;
  }

  rotate(radian: number) {
    let s = Math.sin(radian);
    let c = Math.cos(radian);
    this.x = this.x * c + this.y * -s;
    this.y = this.x * s + this.y * c;
  }
}

export abstract class ObjectBase {
  abstract update(): void;

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

export abstract class Character extends ObjectBase {
  protected state: State;
  position: Vector;
  protected vector: Vector;
  width: number;
  height: number;
  life: number;
  private image: HTMLImageElement;

  constructor(
    state: State,
    image: HTMLImageElement,
    { x = 0, y = 0, w, h, life = 0 }: CharacterOpt
  ) {
    super();
    this.state = state;
    this.position = new Vector(x, y);
    this.vector = Vector.new();
    this.width = w;
    this.height = h;
    this.life = life;
    this.image = image;
  }

  setVector(x: number, y: number) {
    this.vector.set(x, y);
  }

  setVectorFromAngle(angle: number) {
    this.vector.setAngle(angle);
  }

  draw() {
    const offsetX = this.width / 2;
    const offsetY = this.height / 2;
    this.state.ctx.drawImage(
      this.image,
      this.position.x - offsetX,
      this.position.y - offsetY,
      this.width,
      this.height
    );
  }

  rotationDraw() {
    this.state.ctx.save();
    this.state.ctx.translate(this.position.x, this.position.y);
    this.state.ctx.rotate(this.vector.angle - Math.PI * 1.5);

    const offsetX = this.width / 2;
    const offsetY = this.height / 2;
    this.state.ctx.drawImage(
      this.image,
      -offsetX,
      -offsetY,
      this.width,
      this.height
    );

    this.state.ctx.restore();
  }

  isInvincible(): boolean {
    return false;
  }

  destroyed() {}

  abstract update(): void;

  ready(): boolean {
    return !!this.image;
  }
}
