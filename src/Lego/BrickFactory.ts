import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  Mesh,
  MeshLambertMaterial,
} from "three";
//@ts-ignore
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { BrickPose } from "./type";

const STUD_HEIGHT = 0.5;
const STUD_RADIUS = 0.3;

export class BrickFactory {
  model: Mesh;
  height: number;

  constructor(width: number, length: number, height: number, color: string) {
    this.height = height;
    const base = new BoxGeometry(width, length, height);
    base.translate(width / 2, length / 2, height / 2);
    const studs: BufferGeometry[] = [];
    const stud = new CylinderGeometry(STUD_RADIUS, STUD_RADIUS, STUD_HEIGHT);
    stud.rotateX(Math.PI / 2);
    for (let i = 0; i < width; ++i) {
      for (let j = 0; j < length; ++j) {
        const newStud = stud.clone();
        newStud.translate(i + 0.5, j + 0.5, height);
        studs.push(newStud);
      }
    }
    const geometry = BufferGeometryUtils.mergeGeometries([...studs, base]);
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
