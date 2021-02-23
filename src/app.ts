import { Canvas2DUtility } from "./canvas";
import { loadImage } from "./utils";
import viperImage from "./assets/images/viper.png";

export const init = async () => {
  const screen = document.querySelector("#screen") as HTMLCanvasElement;
  const image = await loadImage(viperImage);

  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 480;

  const util = new Canvas2DUtility(screen, CANVAS_WIDTH, CANVAS_HEIGHT);

  let x = CANVAS_WIDTH / 2;
  let y = CANVAS_HEIGHT / 2;

  window.addEventListener("keydown", (event) => {
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
    util.drawRect(0, 0, util.canvas.width, util.canvas.height, "#eeeeee");

    util.context.drawImage(image, x, y);
    requestAnimationFrame(render);
  }
};
