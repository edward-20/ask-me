import './style.css'

import * as THREE from "three";

import { init } from './init';
import raycasterInit from './raycaster';

import { ModeManager } from './mode';
import { IdleMode } from './modes/idle';
import { ConversationMode } from './modes/conversation';

function main() {
  const { scene, camera, renderer } = init();

  const { raycaster, mouse } = raycasterInit();

  // need some way to account for window resizing
  // window.addEventListener('resize', () => {
  //   const width = window.innerWidth
  //   const height = window.innerHeight
  //   //update camera
  //   camera.updateProjectionMatrix()
  //   camera.aspect = width / height
  //   renderer.setSize(width, height)
  // })

  const clock = new THREE.Clock();
  const modeManager = new ModeManager();
  
  // construct event listener callbacks for idle mode
  function _getIntersection(
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

  function handleHoverOverHead(mouseEvent: MouseEvent) {
    const intersection = _getIntersection(mouseEvent, mouse, camera, raycaster, scene)
    let thereIsHitbox = false;
    for (let i = 0; i < intersection.length; i++) {
      const object = intersection[i].object;
      if (object.userData.interactive) {
        thereIsHitbox = true;
      }
    }
    document.body.style.cursor = thereIsHitbox ? 'pointer' : 'default';
  }

  function handleClickOnHead(mouseEvent: MouseEvent) {
    const intersection = _getIntersection(mouseEvent, mouse, camera, raycaster, scene)
    for (let i = 0; i < intersection.length; i++) {
      const object = intersection[i].object;
      if (object.userData.interactive) {
        // go to conversation mode
        modeManager.switchTo(conversationMode);
      }
    }
  }


  const idleMode = new IdleMode(camera, [
    {event: "mousemove", listener: handleHoverOverHead},
    {event: "mousedown", listener: handleClickOnHead},
  ]);
  const conversationMode = new ConversationMode(camera, []);

  // const conversationMode = new ConversationMode(camera);
  modeManager.switchTo(idleMode);

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta()
    modeManager.update(delta);
    renderer.render(scene, camera);
  }
  animate();
}
main();