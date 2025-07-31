import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/*
  set up camera
  set up OrbitControls
  set up scene
    set up light
    set up headMesh from asset
*/
export function init() {
  // (scene, camera) -> | renderer | -> drawn canvas
  // renderer
  const canvas : HTMLElement = document.querySelector( '#c' ) as HTMLCanvasElement;
  const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
  renderer.setSize( window.innerWidth, window.innerHeight );

  // camera
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0.5,0,-2); // this should maybe be done in main, or maybe that's too much separation of concerns cos pretty much this is how we want it
  camera.lookAt(0,0,0);
  const scene = new THREE.Scene()
 
  // light
  const light = new THREE.AmbientLight(0x404040, 25);
  scene.add(light);

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

    const headMesh = root.getObjectByProperty('type', 'Mesh') as THREE.Object3D;
    headMesh.userData.interactive = true;
  })

  return { scene, camera, renderer }
}