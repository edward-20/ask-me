// clear current mode and set to conversation mode

// stop the animation
// remove event listeners for mouse move and mouse down
import { clearContent, typeWord } from "../typing";
export default function conversation() {
  const element = document.getElementsByClassName("info")[0];
  clearContent(element)
  typeWord("Hi, I'm Edward. I'm here to answer your questions about me :)", element)
}

/* below code involves some actions needed to go to conversation mode */

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
      
      // have the face constantly bobbing up and down

      // change the info (go into conversation mode)
      conversation();
      break;