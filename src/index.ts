import { Canvas2DUtility } from "./canvas";
import { loadImage } from "./utils";
import "./style.css";
import viperImage from "./assets/images/viper.png";

window.addEventListener("load", async () => {
  const screen = document.querySelector("#screen") as HTMLCanvasElement;
  const image = await loadImage(viperImage);
  const util = new Canvas2DUtility(screen, 640, 480);
  util.drawRect(0, 0, util.canvas.width, util.canvas.height, "#eeeeee");
  util.context.drawImage(image, 100, 100);
});
