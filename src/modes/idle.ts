import * as THREE from "three";
import type { Mode } from "../mode";
import { typeWord } from "../typing";
import type { EventListener } from "../eventListener";

export class IdleMode implements Mode {
  name = "Idle";
  angle = 0;
  speed = 0.1;
  radius = 3;
  camera: THREE.Camera;
  eventListeners: EventListener[];

  constructor(camera : THREE.Camera, eventListeners: EventListener[]) {
    this.camera = camera;
    this.eventListeners = eventListeners;
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
    this.eventListeners.forEach((eventListener) => {
      document.addEventListener(eventListener.event, eventListener.listener)
    })

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
    this.eventListeners.forEach((eventListener) => {
      document.removeEventListener(eventListener.event, eventListener.listener)
    })
    document.body.style.cursor = 'default';
    return;
  }
}