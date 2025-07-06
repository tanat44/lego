import { Mesh } from "three";
import { Graphic } from "../Graphic/Graphic";
import { BrickFactory } from "./BrickFactory";
import { BrickPattern } from "./type";

export class Lego {
  graphic: Graphic;
  factory: BrickFactory;

  private objects: Mesh[];

  constructor(graphic: Graphic) {
    this.factory = new BrickFactory(2, 4, 1, "#6a76eb");
    this.graphic = graphic;
    this.objects = [];

    const pattern = this.samplePattern();
    this.render(pattern);
  }

  // sample() {
  //   for (let i = 0; i < 100; ++i) {
  //     const brick = this.factory.produce();
  //     brick.position.set(i * 3, 0, 0);
  //     this.scene.add(brick);
  //   }
  // }

  samplePattern(): BrickPattern {
    const pattern: BrickPattern = [
      { x: 0, y: 0, z: 0, rotation: 0 },
      { x: 0, y: 2, z: 1, rotation: -90 },
      { x: 2, y: 2, z: 2, rotation: -90 },
      { x: 2, y: 0, z: 3, rotation: 0 },
      { x: 2, y: 4, z: 4, rotation: -90 },
      { x: 4, y: 4, z: 3, rotation: -90 },
    ];
    return pattern;
  }

  render(pattern: BrickPattern) {
    if (this.objects.length > 0) {
      for (const obj of this.objects) {
        this.graphic.scene.remove(obj);
      }
      this.objects = [];
    }

    for (const pose of pattern) {
      const brick = this.factory.produce(pose);
      this.graphic.scene.add(brick);
      this.objects.push(brick);
    }
  }
}
