type Scene = (time: number) => void;

export class SceneManager {
  scene: { [key: string]: Scene } = {};
  activeScene: Scene | null = null;
  startTime: number = Date.now();
  frame: number = -1;

  add(name: string, updateFunction: Scene) {
    this.scene[name] = updateFunction;
  }

  use(name: string) {
    if (!(name in this.scene)) return;
    this.activeScene = this.scene[name];
    this.startTime = Date.now();
    this.frame = -1;
  }

  update() {
    const activeTime = (Date.now() - this.startTime) / 1000;
    this.activeScene?.(activeTime);
    this.frame++;
  }
}
