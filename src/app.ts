import * as util from "./canvas";
import { State, Player, Shot, Character, Enemy } from "./characters";
import { SceneManager } from "./scene";
import viperImage from "./assets/images/viper.png";
import viperShotImage from "./assets/images/viper_shot.png";
import viperSingleShotImage from "./assets/images/viper_single_shot.png";
import enemySmallImage from "./assets/images/enemy_small.png";
import enemyShotImage from "./assets/images/enemy_shot.png";

export const init = async () => {
  const canvas = document.querySelector("#screen") as HTMLCanvasElement;

  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 480;

  const SHOT_MAX_COUNT = 10;
  const ENEMY_MAX_COUNT = 10;
  const ENEMY_SHOT_MAX_COUNT = 50;

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

  const shotArray = Array.from({ length: SHOT_MAX_COUNT }).map(
    () => new Shot(ctx, viperShotImage, { w: 32, h: 32 })
  );
  const singleShotArray = Array.from({
    length: SHOT_MAX_COUNT * 2,
  }).map(() => new Shot(ctx, viperSingleShotImage, { w: 32, h: 32 }));
  characters.push(...shotArray, ...singleShotArray);

  const player = new Player(
    state,
    ctx,
    viperImage,
    { w: 64, h: 64 },
    { shot: shotArray, singleShot: singleShotArray }
  );
  characters.push(player);
  player.setComing(
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT,
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT - 100
  );

  const enemyShotArray = Array.from({ length: ENEMY_SHOT_MAX_COUNT }).map(
    () => new Shot(ctx, enemyShotImage, { w: 48, h: 48 })
  );
  characters.push(...enemyShotArray);

  const enemyArray = Array.from({ length: ENEMY_MAX_COUNT }).map(
    () => new Enemy(ctx, enemySmallImage, { w: 48, h: 48 }, enemyShotArray)
  );
  characters.push(...enemyArray);
  [...shotArray, ...singleShotArray].forEach((s) => s.setTargets(enemyArray));

  const scene = new SceneManager();
  scene.add("intro", (time) => {
    if (time > 2.0) {
      scene.use("invade");
    }
  });
  scene.add("invade", (time) => {
    if (scene.frame == 0) {
      for (let i = 0; i < ENEMY_MAX_COUNT; i++) {
        if (enemyArray[i].life <= 0) {
          const e = enemyArray[i];
          e.set(CANVAS_WIDTH / 2, -e.height, 2, "default");
          e.setVector(0.0, 1.0);
          break;
        }
      }
    } else if (scene.frame === 100) {
      scene.use("invade");
    }
  });
  scene.use("intro");

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

    scene.update();

    characters.forEach((c) => c.update());
    requestAnimationFrame(render);
  }
};
