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
