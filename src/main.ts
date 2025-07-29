import './style.css'

import * as THREE from "three";

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function main() {
  // (scene, camera) -> | renderer | -> drawn canvas
  // renderer
  const canvas : HTMLElement = document.querySelector( '#c' ) as HTMLCanvasElement;
  const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
  renderer.setSize( window.innerWidth, window.innerHeight );

  // camera
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0.5,0,-2);
  camera.lookAt(0,0,0);
  const scene = new THREE.Scene()
 
  // light
  const color = 0xFFFFFF;
  const intensity = 3;
  // const light = new THREE.AmbientLight(0x404040, 25);
  // const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  const light = new THREE.AmbientLight(0x404040, 25);
  // const light = new THREE.DirectionalLight(color, intensity);
  // light.position.set(5, 0, 0);
  scene.add(light);

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  // add orbit controls
  const controls = new OrbitControls( camera, renderer.domElement );
  controls.enableDamping = true;   // Adds smooth inertia
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;      // Allow zooming
  controls.enablePan = true;       // Allow panning
  controls.autoRotate = false;     // Enable if you want auto rotation
  controls.autoRotateSpeed = 2.0;  // Adjust speed if autoRotate is true
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN
  };


  // load in the asset
  const loader = new GLTFLoader();
  const url = '/just-me.glb';
  loader.load(url, (gltf) => {
    const root = gltf.scene;
    scene.add(root);
  })

  // clock
  let clock = new THREE.Clock();

  // animation loop callback
  function animate() {
    renderer.render(scene, camera);
    
    // pan along x axis
    const t = clock.getElapsedTime();
    const amplitude = 0.5;
    const frequency = 0.1;
    camera.position.x = Math.sin(t * 2 * Math.PI * frequency) * amplitude;
    camera.lookAt(0,0,0);
    // angle += speed;
    // light.position.x = Math.cos(angle) * radius;
    // light.position.y = Math.sin(angle) * radius;
    // light.position.z = 0; // stays flat on XY plane

    controls.update();
    requestAnimationFrame(animate);
  }
  animate();
}
main();