import './style.css'

import * as THREE from "three";

import { init } from './init';
import raycasterInit from './raycaster';

import { ModeManager } from './mode';
import { IdleMode } from './modes/idle';

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
  const idleMode = new IdleMode(camera, mouse, raycaster, scene);
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