import { Scene } from "three";
import { BrickFactory } from "./BrickFactory";

export class Lego {
  constructor(scene: Scene) {
    const factory = new BrickFactory(2, 4, 1, "#6a76eb");

    for (let i = 0; i < 100; ++i) {
      const brick = factory.produce();
      brick.position.set(i * 3, 0, 0);
      scene.add(brick);
    }
  }
}
