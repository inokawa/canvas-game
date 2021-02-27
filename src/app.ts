import * as util from "./canvas";
import {
  State,
  Player,
  Shot,
  Enemy,
  Explosion,
  ObjectBase,
} from "./characters";
import { SceneManager } from "./scene";
import { array } from "./utils";
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
  const EXPLOSION_MAX_COUNT = 10;

  const state: State = {
    key: {
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

  const objects: ObjectBase[] = [];

  const shots = array(
    SHOT_MAX_COUNT,
    () => new Shot(ctx, viperShotImage, { w: 32, h: 32 })
  );

  const singleShots = array(
    SHOT_MAX_COUNT * 2,
    () => new Shot(ctx, viperSingleShotImage, { w: 32, h: 32 })
  );
  objects.push(...shots, ...singleShots);

  const player = new Player(
    state,
    ctx,
    viperImage,
    { w: 64, h: 64 },
    { shot: shots, singleShot: singleShots }
  );
  objects.push(player);
  player.setComing(
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT,
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT - 100
  );

  const enemyShots = array(
    ENEMY_SHOT_MAX_COUNT,
    () => new Shot(ctx, enemyShotImage, { w: 48, h: 48 })
  );
  objects.push(...enemyShots);

  const enemies = array(
    ENEMY_MAX_COUNT,
    () => new Enemy(ctx, enemySmallImage, { w: 48, h: 48 }, enemyShots)
  );
  objects.push(...enemies);

  const explosions = array(
    EXPLOSION_MAX_COUNT,
    () => new Explosion(ctx, 50.0, 15, 30.0, 0.25)
  );
  objects.push(...explosions);

  [...shots, ...singleShots].forEach((s) => {
    s.setTargets(enemies);
    s.setExplosions(explosions);
  });

  const scene = new SceneManager();
  scene.add("intro", (time) => {
    if (time > 2.0) {
      scene.use("invade");
    }
  });
  scene.add("invade", (time) => {
    if (scene.frame == 0) {
      for (const e of enemies) {
        if (e.life <= 0) {
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
        state.key.arrowLeft = true;
        break;
      case "ArrowRight":
        state.key.arrowRight = true;
        break;
      case "ArrowUp":
        state.key.arrowUp = true;
        break;
      case "ArrowDown":
        state.key.arrowDown = true;
        break;
      case "z":
        state.key.z = true;
        break;
      default:
        break;
    }
  });
  window.addEventListener("keyup", (event) => {
    switch (event.key) {
      case "ArrowLeft":
        state.key.arrowLeft = false;
        break;
      case "ArrowRight":
        state.key.arrowRight = false;
        break;
      case "ArrowUp":
        state.key.arrowUp = false;
        break;
      case "ArrowDown":
        state.key.arrowDown = false;
        break;
      case "z":
        state.key.z = false;
        break;
      default:
        break;
    }
  });

  let startTime: number;
  (function wait() {
    const isReady = objects.every((c) => c.ready());
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

    objects.forEach((c) => c.update());
    requestAnimationFrame(render);
  }
};
