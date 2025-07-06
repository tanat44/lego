import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  Mesh,
  MeshLambertMaterial,
} from "three";
import { BrickPose } from "./type";
//@ts-ignore
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

const STUD_HEIGHT = 0.5;
const STUD_RADIUS = 0.3;
const BLOCK_GAP = 0.01;

export class BrickFactory {
  model: Mesh;
  height: number;

  constructor(width: number, length: number, height: number, color: string) {
    this.height = height;
    const base = new BoxGeometry(
      width - BLOCK_GAP * 2,
      length - BLOCK_GAP * 2,
      height - BLOCK_GAP * 2
    );
    base.translate(
      width / 2 + BLOCK_GAP,
      length / 2 + BLOCK_GAP,
      height / 2 + BLOCK_GAP
    );
    for (let i = 0; i < base.attributes.normal.count; ++i) {
      const z = base.attributes.normal.getZ(i);
      if (z > 0.9) {
        base.attributes.normal.setX(i, 0.5); // hack brick normal so that it's not parallel with pipe
      }
    }
    console.log(base.attributes.normal);

    const studs: BufferGeometry[] = [];
    const stud = new CylinderGeometry(
      STUD_RADIUS,
      STUD_RADIUS,
      STUD_HEIGHT,
      16,
      1,
      false
    );
    stud.rotateX(Math.PI / 2);
    for (let i = 0; i < width; ++i) {
      for (let j = 0; j < length; ++j) {
        const newStud = stud.clone();
        newStud.translate(i + 0.5, j + 0.5, height);
        studs.push(newStud);
      }
    }
    const geometry = mergeGeometries([...studs, base]);
    geometry.computeBoundingBox();
    const material = new MeshLambertMaterial({ color });
    this.model = new Mesh(geometry, material);
  }

  produce(pose: BrickPose): Mesh {
    const brick = this.model.clone();
    brick.position.set(pose.x, pose.y, pose.z * this.height);
    brick.rotation.z = (pose.rotation / 180) * Math.PI;
    return brick;
  }
}
