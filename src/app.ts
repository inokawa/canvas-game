import * as util from "./canvas";
import { State, Player, Shot, Character } from "./characters";
import viperImage from "./assets/images/viper.png";
import viperShotImage from "./assets/images/viper_shot.png";
import viperSingleShotImage from "./assets/images/viper_single_shot.png";

export const init = async () => {
  const canvas = document.querySelector("#screen") as HTMLCanvasElement;

  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 480;

  const SHOT_MAX_COUNT = 10;

  const state: State = {
    isKeyDown: {
      arrowLeft: false,
      arrowRight: false,
      arrowDown: false,
      arrowUp: false,
      z: false,
    },
  };

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d")!;

  const characters: Character[] = [];
  const player = new Player(state, ctx, 0, 0, 64, 64, viperImage);
  characters.push(player);
  player.setComing(
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT,
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT - 100
  );
  const shotArray: Shot[] = Array.from({ length: SHOT_MAX_COUNT }).map(
    () => new Shot(ctx, 0, 0, 32, 32, viperShotImage)
  );
  const singleShotArray: Shot[] = Array.from({
    length: SHOT_MAX_COUNT * 2,
  }).map(() => new Shot(ctx, 0, 0, 32, 32, viperSingleShotImage));
  player.setShotArray(shotArray, singleShotArray);
  characters.push(...shotArray, ...singleShotArray);

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
      case "z":
        state.isKeyDown.z = true;
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
      case "z":
        state.isKeyDown.z = false;
        break;
      default:
        break;
    }
  });

  let startTime: number;
  (function wait() {
    const isReady = characters.every((c) => c.ready());
    if (!isReady) {
      setTimeout(wait, 100);
      return;
    }
    startTime = Date.now();
    render();
  })();

  function render() {
    ctx.globalAlpha = 1.0;
    util.drawRect(ctx, 0, 0, canvas.width, canvas.height, "#eeeeee");

    characters.forEach((c) => c.update());
    requestAnimationFrame(render);
  }
};
