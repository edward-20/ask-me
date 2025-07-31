export interface Mode {
  init(): void,
  update(delta: number): void,
  dispose(): void,
}

export class ModeManager {
  private currentMode: Mode | null = null;

  switchTo(mode: Mode) {
    if (this.currentMode) {
      this.currentMode.dispose();
    }
    this.currentMode = mode;
    this.currentMode.init();
  }

  update(delta: number) {
    if (this.currentMode) {
      this.currentMode.update(delta);
    }
  }
}
