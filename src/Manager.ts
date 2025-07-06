import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  Color,
  DoubleSide,
  GridHelper,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrthoCamera } from "./OrthoCamera";

const GRID_SIZE = 100;

export class Manager {
  scene: Scene;
  orthoCamera: OrthoCamera;
  renderer: WebGLRenderer;

  constructor() {
    this.setupScene();
    this.setupLighting();
    this.addTestObject();
    this.onWindowResize();
    this.animate();
  }

  drawCube(pos: Vector3, color: string) {
    const geometry2 = new BoxGeometry(1, 1, 1);
    const material2 = new MeshBasicMaterial({ color: color });
    const cube2 = new Mesh(geometry2, material2);
    cube2.position.copy(pos);
    this.scene.add(cube2);
  }

  drawLine(to: Vector3, color: string) {
    const material = new LineBasicMaterial({
      color,
    });
    const points = [];
    points.push(new Vector3());
    points.push(to);
    const geometry = new BufferGeometry().setFromPoints(points);
    const line = new Line(geometry, material);
    this.scene.add(line);
  }

  drawPlane() {
    const geometry = new PlaneGeometry(5, 5);
    const material = new MeshBasicMaterial({ color: "pink", side: DoubleSide });
    const plane = new Mesh(geometry, material);
    this.scene.add(plane);
  }

  addTestObject() {
    this.drawCube(new Vector3(0, 0, 0), "black");
    this.drawCube(new Vector3(10, 0, 0), "red");
    this.drawLine(new Vector3(10, 0, 0), "red");
    this.drawCube(new Vector3(0, 10, 0), "green");
    this.drawLine(new Vector3(0, 10, 0), "green");
    this.drawCube(new Vector3(0, 0, 10), "blue");
    this.drawLine(new Vector3(0, 0, 10), "blue");
    this.drawPlane();
  }

  setupLighting() {
    this.scene.add(new AmbientLight(0xf0f0f0));
  }

  setupScene() {
    this.scene = new Scene();
    this.scene.background = new Color(0xf0f0f0);
    const gridHelper = new GridHelper(GRID_SIZE, GRID_SIZE);
    gridHelper.rotateX(Math.PI / 2);
    this.scene.add(gridHelper);

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.orthoCamera = new OrthoCamera(this.renderer.domElement);
    this.scene.add(this.orthoCamera.camera);

    document.body.appendChild(this.renderer.domElement);
    window.addEventListener("resize", this.onWindowResize.bind(this));
    this.renderer.domElement.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  }

  onWindowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.orthoCamera.camera);
  }
}
