import { Canvas2DUtility } from "./canvas";
import { loadImage } from "./utils";
import viperImage from "./assets/images/viper.png";

export const init = async () => {
  const screen = document.querySelector("#screen") as HTMLCanvasElement;
  const image = await loadImage(viperImage);

  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 480;

  const util = new Canvas2DUtility(screen, CANVAS_WIDTH, CANVAS_HEIGHT);
  const startTime = Date.now();
  render();

  function render() {
    util.drawRect(0, 0, util.canvas.width, util.canvas.height, "#eeeeee");

    const currentTime = (Date.now() - startTime) / 1000;
    const s = Math.sin(currentTime);
    const x = s * 100.0;

    util.context.drawImage(image, CANVAS_WIDTH / 2 + x, CANVAS_HEIGHT / 2);
    requestAnimationFrame(render);
  }
};
