import * as THREE from "three";
import type { Mode } from "../mode";
import { div } from "three/tsl";
export function handleHoverOverHead(
  mouseEvent: MouseEvent, {mouse, camera} : MouseCamera, 
  raycaster: THREE.Raycaster, 
  scene: THREE.Scene
) {
  const intersection = _getIntersection(mouseEvent, {mouse, camera}, raycaster, scene)
  let thereIsHitbox = false;
  for (let i = 0; i < intersection.length; i++) {
    const object = intersection[i].object;
    if (object.userData.interactive) {
      thereIsHitbox = true;
    }
  }
  document.body.style.cursor = thereIsHitbox ? 'pointer' : 'default';
}

export function handleClickOnHead(
  // Normalize mouse coordinates
  mouseEvent: MouseEvent, {mouse, camera} : MouseCamera, 
  raycaster: THREE.Raycaster, 
  scene: THREE.Scene
) {
  const intersection = _getIntersection(mouseEvent, {mouse, camera}, raycaster, scene)
  for (let i = 0; i < intersection.length; i++) {
    const object = intersection[i].object;
    if (object.userData.interactive) {
      // go to conversation mode
    }
  }

}

export class IdleMode implements Mode {
  angle = 0;
  speed = 0.2;
  radius = 3;
  camera: THREE.Camera;

  constructor(camera : THREE.Camera) {
    this.camera = camera;
  }

  init() {
    const divElement = document.createElement('div');
    divElement.innerHTML = "Click on me to start conversation mode";
    divElement.className = "info";
    document.body.appendChild(divElement);
    console.log('hello');
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
        * stopping any camera motion
        * removing info
        * remove event listeners for mouse move and mouse down
    */
    // removing info
    document.getElementsByClassName("info")[0].remove();
    return;
  }
}

/*
window.removeEventListener('mousedown', handleClickOnHead);

// pans in non-conversation mode, doesn't pan in conversation mode
let shouldPan = true;

interface MouseCamera {
  mouse: THREE.Vector2,
  camera: THREE.Camera,
}

function _getIntersection(
  mouseEvent: MouseEvent, {mouse, camera} : MouseCamera, 
  raycaster: THREE.Raycaster, 
  scene: THREE.Scene
) {

  const event = mouseEvent;
  // Normalize mouse coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // Check intersections with scene children
  return raycaster.intersectObjects(scene.children, true);
}

window.addEventListener('mousemove', handleHoverOverHead, false);
window.addEventListener('mousedown', handleClickOnHead, false)

// clock for dolly panning
let clock = new THREE.Clock();

function pan() {
  // pan along x axis
  const t = clock.getElapsedTime();
  const radius = 3;
  const speed = 0.1;
  camera.position.x = Math.sin(t * 2 * Math.PI * speed) * radius;
  camera.position.z = -Math.cos(t * 2 * Math.PI * speed) * radius;
  camera.lookAt(0,0,0);
}

// animation loop callback
function animate() {
  renderer.render(scene, camera);
  
  // angle += speed;
  // light.position.x = Math.cos(angle) * radius;
  // light.position.y = Math.sin(angle) * radius;
  // light.position.z = 0; // stays flat on XY plane

  if (shouldPan) pan();

  controls.update();
  requestAnimationFrame(animate);
}
animate();
typeWord("Click on me to start asking questions", document.getElementsByClassName("info")[0]);
*/