import { OrthographicCamera } from "three";
import { OrthoOrbit } from "./OrthoOrbit";

export class OrthoCamera {
  camera: OrthographicCamera;
  orbit: OrthoOrbit;

  constructor(domElement: HTMLElement) {
    // camera
    this.camera = new OrthographicCamera();
    this.camera.position.set(-10, -20, 5);
    this.camera.up.set(0, 0, 1);
    this.camera.lookAt(0, 0, 0);

    // orbit
    this.orbit = new OrthoOrbit(this.camera, domElement);
  }
}
