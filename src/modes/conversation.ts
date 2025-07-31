
// stop the animation
// remove event listeners for mouse move and mouse down
import * as THREE from "three";
import gsap from "gsap";
import type { Mode } from "../mode";
import { typeWord } from "../typing";
import type { EventListener } from "../eventListener";

export class ConversationMode implements Mode {
  camera: THREE.Camera;
  eventListeners: EventListener[];
  constructor(camera : THREE.Camera, eventListeners: EventListener[]) {
    this.camera = camera;
    this.eventListeners = eventListeners;
  }

  init() {
    console.log("hello")
    gsap.to(this.camera.position, {
      duration: 2,
      x: 0,
      y: 0,
      z: -2,
      ease: "power2.inOut",
      onUpdate: () => {
        this.camera.lookAt(0,0,0);
      }
    })
    const divElement = document.createElement('div');
    divElement.className = "info";
    document.body.appendChild(divElement);
    typeWord("Hi, what would you like to know about me?", document.getElementsByClassName("info")[0]);
    this.eventListeners.forEach((eventListener) => {
      document.addEventListener(eventListener.event, eventListener.listener)
    })
  }

  update(delta: number) {}

  dispose() {
    /* 
      * what does clearing involve?
        * removing info
        * remove event listeners for mouse move and mouse down
    */
    // removing info
    document.getElementsByClassName("info")[0].remove();

    // removing event listeners
    this.eventListeners.forEach((eventListener) => {
      document.removeEventListener(eventListener.event, eventListener.listener)
    })
    return;
  }
}