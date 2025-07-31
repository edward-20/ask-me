import * as THREE from "three";
import type { Mode } from "../mode";
import { typeWord } from "../typing";

export class IdleMode implements Mode {
  angle = 0;
  speed = 0.2;
  radius = 3;
  camera: THREE.Camera;
  mouse: THREE.Vector2;
  raycaster: THREE.Raycaster;
  scene: THREE.Scene;

  constructor(camera : THREE.Camera, mouse: THREE.Vector2, raycaster: THREE.Raycaster, scene: THREE.Scene) {
    this.camera = camera;
    this.mouse = mouse;
    this.raycaster = raycaster;
    this.scene = scene;
  }

  _getIntersection(
    mouseevent: MouseEvent, mouse: THREE.Vector2, camera : THREE.Camera, 
    raycaster: THREE.Raycaster, 
    scene: THREE.Scene
  ) {

    const event = mouseevent;
    // normalize mouse coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // check intersections with scene children
    return raycaster.intersectObjects(scene.children, true);
  }

  handleHoverOverHead(mouseEvent: MouseEvent) {
    const intersection = this._getIntersection(mouseEvent, this.mouse, this.camera, this.raycaster, this.scene)
    let thereIsHitbox = false;
    for (let i = 0; i < intersection.length; i++) {
      const object = intersection[i].object;
      if (object.userData.interactive) {
        thereIsHitbox = true;
      }
    }
    document.body.style.cursor = thereIsHitbox ? 'pointer' : 'default';
  }

  handleClickOnHead(mouseEvent: MouseEvent) {
    const intersection = this._getIntersection(mouseEvent, this.mouse, this.camera, this.raycaster, this.scene)
    for (let i = 0; i < intersection.length; i++) {
      const object = intersection[i].object;
      if (object.userData.interactive) {
        // go to conversation mode
      }
    }

  }


  init() {
    /* 
      * what does init involve?
        * initialising the angle, speed, radius and camera so that update() can use
        * creating info element
        * creating event listeners for mouse move and mouse down
    */
    // create info div element
    const divElement = document.createElement('div');
    divElement.className = "info";
    document.body.appendChild(divElement);
    typeWord("Click on me to start asking questions", document.getElementsByClassName("info")[0]);

    window.addEventListener('mousemove', this.handleHoverOverHead.bind(this), false);
    window.addEventListener('mousedown', this.handleClickOnHead.bind(this), false)
    return;
  }

  update(delta: number) {
    this.angle += (delta * 2 * Math.PI * this.speed) % (2 * Math.PI);
    this.camera.position.x = Math.sin(this.angle) * this.radius;
    this.camera.position.z = -Math.cos(this.angle) * this.radius;
    this.camera.lookAt(0,0,0);
    return;
  }

  dispose() {
    /* 
      * what does clearing involve?
        * stopping any camera motion (maybe don't need to)
        * removing info
        * remove event listeners for mouse move and mouse down
    */
    // removing info
    document.getElementsByClassName("info")[0].remove();

    // removing event listeners
    document.removeEventListener("mousedown", this.handleClickOnHead);
    document.removeEventListener("mouseover", this.handleClickOnHead);
    return;
  }
}