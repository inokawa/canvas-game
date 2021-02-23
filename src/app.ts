import { Canvas2DUtility } from "./canvas";
import { loadImage } from "./utils";
import viperImage from "./assets/images/viper.png";

export const init = async () => {
  const screen = document.querySelector("#screen") as HTMLCanvasElement;
  const image = await loadImage(viperImage);

  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 480;

  const util = new Canvas2DUtility(screen, CANVAS_WIDTH, CANVAS_HEIGHT);

  let isComing = true;
  let x = CANVAS_WIDTH / 2;
  let y = CANVAS_HEIGHT;

  window.addEventListener("keydown", (event) => {
    if (isComing) return;
    switch (event.key) {
      case "ArrowLeft":
        x -= 10;
        break;
      case "ArrowRight":
        x += 10;
        break;
      case "ArrowUp":
        y -= 10;
        break;
      case "ArrowDown":
        y += 10;
        break;
      default:
        break;
    }
  });

  const startTime = Date.now();
  render();

  function render() {
    util.context.globalAlpha = 1.0;
    util.drawRect(0, 0, util.canvas.width, util.canvas.height, "#eeeeee");
    const currentTime = (Date.now() - startTime) / 1000;

    if (isComing) {
      const justTime = Date.now();
      const comingTime = (justTime - startTime) / 1000;
      y = CANVAS_HEIGHT - comingTime * 50;
      if (y <= CANVAS_HEIGHT - 100) {
        isComing = false;
        y = CANVAS_HEIGHT - 100;
      }
      if (justTime % 100 < 50) {
        util.context.globalAlpha = 0.5;
      }
    }

    util.context.drawImage(image, x, y);
    requestAnimationFrame(render);
  }
};
