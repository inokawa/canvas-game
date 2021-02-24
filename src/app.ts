import * as util from "./canvas";
import { Player } from "./characters";
import { loadImage } from "./utils";
import viperImage from "./assets/images/viper.png";

export const init = async () => {
  const canvas = document.querySelector("#screen") as HTMLCanvasElement;
  const image = await loadImage(viperImage);

  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 480;

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d")!;
  const player = new Player(ctx, 0, 0, 64, 64, image);
  player.setComing(
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT,
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT - 100
  );

  window.addEventListener("keydown", (event) => {
    if (player.isComing) return;
    switch (event.key) {
      case "ArrowLeft":
        player.position.x -= 10;
        break;
      case "ArrowRight":
        player.position.x += 10;
        break;
      case "ArrowUp":
        player.position.y -= 10;
        break;
      case "ArrowDown":
        player.position.y += 10;
        break;
      default:
        break;
    }
  });

  const startTime = Date.now();
  render();

  function render() {
    ctx.globalAlpha = 1.0;
    util.drawRect(ctx, 0, 0, canvas.width, canvas.height, "#eeeeee");

    player.update();
    requestAnimationFrame(render);
  }
};
