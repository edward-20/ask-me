import * as THREE from "three";

// hitbox
export default function raycasterInit() {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  return { raycaster, mouse }
}