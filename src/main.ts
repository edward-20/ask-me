import './style.css'

import * as THREE from "three";
import gsap from 'gsap';

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

  // hitbox
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  let shouldPan = true;

  function onMouseMove(event : MouseEvent) {
    // Normalize mouse coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Check intersections with scene children
    const intersects = raycaster.intersectObjects(scene.children, true);
    let thereIsHitbox = false;
    for (let i = 0; i < intersects.length; i++) {
      const object = intersects[i].object;
      if (object.userData.interactive) {
        thereIsHitbox = true;
      }
    }
    document.body.style.cursor = thereIsHitbox ? 'pointer' : 'default';

  }

  function handleMouseDown(event: MouseEvent) {
    // Normalize mouse coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Check intersections with scene children
    const intersects = raycaster.intersectObjects(scene.children, true);
    for (let i = 0; i < intersects.length; i++) {
      const object = intersects[i].object;
      if (object.userData.interactive) {
        // go to focus mode    
        shouldPan = false;
        gsap.to(camera.position, {
          duration: 2,
          x: 0,
          y: 0,
          z: -2,
          ease: "power2.inOut",
          onUpdate: () => {
            camera.lookAt(0,0,0);
          }
        })
      }
    }
  }

  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('mousedown', handleMouseDown, false)

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

  // need some way to account for window resizing
  // window.addEventListener('resize', () => {
  //   const width = window.innerWidth
  //   const height = window.innerHeight
  //   //update camera
  //   camera.updateProjectionMatrix()
  //   camera.aspect = width / height
  //   renderer.setSize(width, height)
  // })
}
main();