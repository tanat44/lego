import { OrthographicCamera, Plane, Raycaster, Vector2, Vector3 } from "three";

const ORBIT_RADIUS = 100;

export class OrthoOrbit {
  private camera: OrthographicCamera;
  private domElement: HTMLElement;
  private rayCaster: Raycaster;

  private cameraStartPosition: Vector3 | null = null;
  private mouseDownScreen: Vector2 | null = null;
  private mouseWorldLast: Vector3 | null = null;
  private mouseButton: number = 0; // 1 = left click, 2 = right click
  private zoom: number = 1;

  constructor(camera: OrthographicCamera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.rayCaster = new Raycaster();

    this.domElement.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.domElement.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.domElement.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.domElement.addEventListener("wheel", this.onWheel.bind(this));
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  render() {}

  private onMouseDown(event: MouseEvent): void {
    this.mouseDownScreen = this.getMouseScreenPosition(event);
    const pos = this.unproject(this.mouseDownScreen);
    if (!pos) return;

    this.cameraStartPosition = this.camera.position.clone();
    this.mouseButton = event.button;
    this.mouseWorldLast = pos;
    new Vector2(event.clientX, event.clientY);
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.mouseWorldLast) return;

    const newScreenPos = this.getMouseScreenPosition(event);
    const newWorldPos = this.unproject(newScreenPos);
    if (!newWorldPos) return;

    if (this.mouseButton == 1) {
      // left click
    } else if (this.mouseButton == 2) {
      // right click
      const move = this.unproject(newScreenPos.clone())
        .sub(this.unproject(this.mouseDownScreen))
        .multiplyScalar(2);
      const newCamera = this.cameraStartPosition
        .clone()
        .sub(move)
        .normalize()
        .multiplyScalar(ORBIT_RADIUS);
      this.camera.position.set(newCamera.x, newCamera.y, newCamera.z);
    }

    // console.log("Mouse move event:", event);
  }

  private onMouseUp(event: MouseEvent): void {
    this.mouseWorldLast = null;
  }

  private onWheel(event: WheelEvent): void {
    let y = event.deltaY;
    let zoom = this.zoom;
    if (y > 0) {
      zoom *= 1.1; // Zoom in
    } else {
      zoom /= 1.1; // Zoom out
    }
    this.updateZoom(zoom, this.getMouseScreenPosition(event));
  }

  private unproject(screenPos: Vector2): Vector3 {
    return new Vector3(screenPos.x, screenPos.y, 1).unproject(this.camera);
  }

  private getMouseScreenPosition(event: MouseEvent | WheelEvent): Vector2 {
    let mousePosition = new Vector2();

    mousePosition.x =
      (event.clientX - this.domElement.offsetLeft) /
        this.domElement.offsetWidth -
      1;
    mousePosition.y =
      -(
        (event.clientY - this.domElement.offsetTop) /
        this.domElement.offsetHeight
      ) + 1;
    return mousePosition;
  }

  private getMouseWorldPosition(screenPosition: Vector2): Vector3 {
    this.rayCaster.setFromCamera(screenPosition, this.camera);

    let point = new Vector3();
    if (
      !this.rayCaster.ray.intersectPlane(
        new Plane(new Vector3(0, 0, 1), 0),
        point
      )
    ) {
      console.warn("Raycaster did not intersect with the plane.");
      return null;
    }

    return point;
  }

  updateZoom(zoom: number, center?: Vector2): void {
    let aspect = window.innerWidth / window.innerHeight;
    this.camera.left = -1 / zoom / 2;
    this.camera.right = 1 / zoom / 2;
    this.camera.top = 1 / zoom / 2 / aspect;
    this.camera.bottom = -1 / zoom / 2 / aspect;

    // if (center) {
    //   const oldPos = this.getMouseWorldPosition(center);
    //   if (!oldPos) return;
    //   const newCenter = center.multiplyScalar(zoom / this.zoom);
    //   const newPos = this.getMouseWorldPosition(newCenter);
    //   if (!newPos) return;
    //   const move = newPos.sub(oldPos);
    //   const newCameraPos = this.camera.position
    //     .clone()
    //     .sub(move)
    //     .normalize()
    //     .multiplyScalar(ORBIT_RADIUS);
    //   this.camera.position.set(newCameraPos.x, newCameraPos.y, newCameraPos.z);
    // }
    this.camera.updateProjectionMatrix();
    this.zoom = zoom;
  }

  private onWindowResize(): void {
    this.updateZoom(this.zoom);
  }
}
