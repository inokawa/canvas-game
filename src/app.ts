import * as util from "./canvas";
import { Player, Shot, Enemy, Explosion, ObjectBase } from "./characters";
import { SceneManager } from "./scene";
import { initState } from "./state";
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

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d")!;
  const state = initState(ctx);
  let restart: boolean = false;

  const objects: ObjectBase[] = [];

  const shots = array(
    SHOT_MAX_COUNT,
    () => new Shot(state, viperShotImage, { w: 32, h: 32 })
  );

  const singleShots = array(
    SHOT_MAX_COUNT * 2,
    () => new Shot(state, viperSingleShotImage, { w: 32, h: 32 })
  );
  objects.push(...shots, ...singleShots);

  const player = new Player(
    state,
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
    () => new Shot(state, enemyShotImage, { w: 48, h: 48 })
  );
  objects.push(...enemyShots);

  const enemies = array(
    ENEMY_MAX_COUNT,
    () => new Enemy(state, enemySmallImage, { w: 48, h: 48 }, enemyShots)
  );
  objects.push(...enemies);

  const explosions = array(
    EXPLOSION_MAX_COUNT,
    () => new Explosion(ctx, 100.0, 15, 40.0, 1.0)
  );
  objects.push(...explosions);

  [...shots, ...singleShots].forEach((s) => {
    s.setTargets(enemies);
    s.setExplosions(explosions);
  });
  enemyShots.forEach((s) => {
    s.setTargets([player]);
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
    if (player.life <= 0) {
      scene.use("gameover");
    }
  });
  scene.add("gameover", (time) => {
    const textWidth = CANVAS_WIDTH / 2;
    const loopWidth = CANVAS_WIDTH + textWidth;
    const x = CANVAS_WIDTH - ((scene.frame * 2) % loopWidth);
    ctx.font = "bold 72px sans-serif";
    util.drawText(ctx, "GAME OVER", x, CANVAS_HEIGHT / 2, "#ff0000", textWidth);
    if (restart) {
      restart = false;
      state.gameScore.reset();
      player.setComing(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT + 50,
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT - 100
      );
      scene.use("intro");
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
      case "Enter":
        if (player.life <= 0) {
          restart = true;
        }
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

    ctx.font = "bold 24px monospace";
    util.drawText(ctx, state.gameScore.display(), 30, 50, "#111111");

    scene.update();

    objects.forEach((c) => c.update());
    requestAnimationFrame(render);
  }
};
