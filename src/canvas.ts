export const drawRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
) => {
  if (color != null) {
    context.fillStyle = color;
  }
  context.fillRect(x, y, width, height);
};

export const drawText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
  width?: number
) => {
  if (color != null) {
    context.fillStyle = color;
  }
  context.fillText(text, x, y, width);
};
