import * as util from "./canvas";
import {
  Player,
  Shot,
  Enemy,
  Explosion,
  ObjectBase,
  Boss,
  Homing,
} from "./characters";
import { SceneManager } from "./scene";
import { initState } from "./state";
import { array, degToRad, loadImage } from "./utils";
import viperImage from "./assets/images/viper.png";
import viperShotImage from "./assets/images/viper_shot.png";
import viperSingleShotImage from "./assets/images/viper_single_shot.png";
import enemySmallImage from "./assets/images/enemy_small.png";
import enemyLargeImage from "./assets/images/enemy_large.png";
import enemyShotImage from "./assets/images/enemy_shot.png";
import bossImage from "./assets/images/boss.png";
import homingImage from "./assets/images/homing_shot.png";
import { BackgroundStar } from "./characters/background";

export const init = async () => {
  const canvas = document.querySelector("#screen") as HTMLCanvasElement;

  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 480;

  const SHOT_MAX_COUNT = 10;
  const ENEMY_SMALL_MAX_COUNT = 20;
  const ENEMY_LARGE_MAX_COUNT = 5;
  const ENEMY_SHOT_MAX_COUNT = 50;
  const HOMING_MAX_COUNT = 50;

  const EXPLOSION_MAX_COUNT = 10;

  const BACKGROUND_STAR_MAX_COUNT = 100;
  const BACKGROUND_STAR_MAX_SIZE = 3;
  const BACKGROUND_STAR_MAX_SPEED = 4;

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d")!;
  const state = initState(ctx);
  let restart: boolean = false;

  const images = await Promise.all([
    loadImage(viperImage),
    loadImage(viperShotImage),
    loadImage(viperSingleShotImage),
  ]);
  const enemyImages = await Promise.all([
    loadImage(enemySmallImage),
    loadImage(enemyLargeImage),
    loadImage(enemyShotImage),
    loadImage(bossImage),
    loadImage(homingImage),
  ]);

  const objects: ObjectBase[] = [];

  const shots = array(
    SHOT_MAX_COUNT,
    () => new Shot(state, images[1], { w: 32, h: 32 })
  );

  const singleShots = array(
    SHOT_MAX_COUNT * 2,
    () => new Shot(state, images[2], { w: 32, h: 32 })
  );
  objects.push(...shots, ...singleShots);

  const player = new Player(
    state,
    images[0],
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

  const homings = array(
    HOMING_MAX_COUNT,
    () => new Homing(state, enemyImages[4], { w: 32, h: 32 })
  );
  const enemyShots = [
    ...array(
      ENEMY_SHOT_MAX_COUNT,
      () => new Shot(state, enemyImages[2], { w: 48, h: 48 })
    ),
    ...homings,
  ];
  objects.push(...enemyShots);

  const boss = new Boss(
    state,
    enemyImages[3],
    { w: 128, h: 128 },
    player,
    enemyShots,
    homings
  );
  const enemies = [
    ...array(
      ENEMY_SMALL_MAX_COUNT,
      () =>
        new Enemy(state, enemyImages[0], { w: 48, h: 48 }, player, enemyShots)
    ),
    ...array(
      ENEMY_LARGE_MAX_COUNT,
      () =>
        new Enemy(state, enemyImages[1], { w: 64, h: 64 }, player, enemyShots)
    ),
    boss,
  ];
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

  const backgroundStars = array(BACKGROUND_STAR_MAX_COUNT, () => {
    const size = 1 + Math.random() * (BACKGROUND_STAR_MAX_SIZE - 1);
    const speed = 1 + Math.random() * (BACKGROUND_STAR_MAX_SPEED - 1);
    const star = new BackgroundStar(state, size, speed);
    star.set(Math.random() * CANVAS_WIDTH, Math.random() * CANVAS_HEIGHT);
    return star;
  });
  objects.push(...backgroundStars);

  const scene = new SceneManager();
  scene.add("intro", (time) => {
    if (time > 3.0) {
      scene.use("invade_default_type");
    }
  });
  scene.add("invade_default_type", (time) => {
    if (scene.frame % 30 == 0) {
      for (const e of enemies) {
        if (e.life <= 0) {
          if (scene.frame % 60 === 0) {
            e.set(-e.width, 30, 2, "default");
            e.setVectorFromAngle(degToRad(30));
          } else {
            e.set(CANVAS_WIDTH + e.width, 30, 2, "default");
            e.setVectorFromAngle(degToRad(150));
          }
          break;
        }
      }
    }
    if (scene.frame === 270) {
      scene.use("blank");
    }
    if (player.life <= 0) {
      scene.use("gameover");
    }
  });
  scene.add("blank", (time) => {
    if (scene.frame === 150) {
      scene.use("invade_wave_move_type");
    }
    if (player.life <= 0) {
      scene.use("gameover");
    }
  });
  scene.add("invade_wave_move_type", (time) => {
    if (scene.frame % 50 === 0) {
      for (const e of enemies) {
        if (e.life <= 0) {
          if (scene.frame <= 200) {
            e.set(CANVAS_WIDTH * 0.2, -e.height, 2, "wave");
          } else {
            e.set(CANVAS_WIDTH * 0.8, -e.height, 2, "wave");
          }
          break;
        }
      }
    }
    if (scene.frame === 450) {
      scene.use("invade_large_type");
    }
    if (player.life <= 0) {
      scene.use("gameover");
    }
  });
  scene.add("invade_large_type", (time) => {
    if (scene.frame === 100) {
      let max = ENEMY_SMALL_MAX_COUNT + ENEMY_LARGE_MAX_COUNT;
      for (let i = ENEMY_SMALL_MAX_COUNT; i < max; i++) {
        if (enemies[i].life <= 0) {
          let e = enemies[i];
          e.set(CANVAS_WIDTH / 2, -e.height, 50, "large");
          break;
        }
      }
    }
    if (scene.frame === 500) {
      scene.use("invade_boss");
    }
    if (player.life <= 0) {
      scene.use("gameover");
    }
  });
  scene.add("invade_boss", (time) => {
    if (scene.frame === 0) {
      boss.set(CANVAS_WIDTH / 2, -boss.height, 250);
      boss.setMode("invade");
    }
    if (player.life <= 0) {
      scene.use("gameover");
      boss.setMode("escape");
    }
    if (boss.life <= 0) {
      scene.use("intro");
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
    util.drawRect(ctx, 0, 0, canvas.width, canvas.height, "#111122");

    ctx.font = "bold 24px monospace";
    util.drawText(ctx, state.gameScore.display(), 30, 50, "#ffffff");

    scene.update();

    objects.forEach((c) => c.update());
    requestAnimationFrame(render);
  }
};
