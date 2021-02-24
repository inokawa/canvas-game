import * as util from "./canvas";
import { Player, State } from "./characters";
import { loadImage } from "./utils";
import viperImage from "./assets/images/viper.png";

export const init = async () => {
  const canvas = document.querySelector("#screen") as HTMLCanvasElement;
  const image = await loadImage(viperImage);

  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 480;

  const state: State = {
    isKeyDown: {
      arrowLeft: false,
      arrowRight: false,
      arrowDown: false,
      arrowUp: false,
    },
  };

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d")!;
  const player = new Player(state, ctx, 0, 0, 64, 64, image);
  player.setComing(
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT,
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT - 100
  );

  window.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowLeft":
        state.isKeyDown.arrowLeft = true;
        break;
      case "ArrowRight":
        state.isKeyDown.arrowRight = true;
        break;
      case "ArrowUp":
        state.isKeyDown.arrowUp = true;
        break;
      case "ArrowDown":
        state.isKeyDown.arrowDown = true;
        break;
      default:
        break;
    }
  });
  window.addEventListener("keyup", (event) => {
    switch (event.key) {
      case "ArrowLeft":
        state.isKeyDown.arrowLeft = false;
        break;
      case "ArrowRight":
        state.isKeyDown.arrowRight = false;
        break;
      case "ArrowUp":
        state.isKeyDown.arrowUp = false;
        break;
      case "ArrowDown":
        state.isKeyDown.arrowDown = false;
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
