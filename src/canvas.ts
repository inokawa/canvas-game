export class Canvas2DUtility {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = canvas.getContext("2d")!;
  }

  drawRect(x: number, y: number, width: number, height: number, color: string) {
    if (color != null) {
      this.context.fillStyle = color;
    }
    this.context.fillRect(x, y, width, height);
  }
}
