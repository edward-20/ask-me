
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
    // use innerHTML
    const divElement = document.createElement('div');
    divElement.className = "info";
    document.body.appendChild(divElement);
    
    divElement.innerHTML = `
      <span class="message"></span>
      <button class="exit">x</button>
    `
    typeWord("Hi, what would you like to know about me?", document.getElementsByClassName("message")[0]);

    fetch("http://localhost:5000/")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parse JSON body
    })
    .then((data : { question: string, answer: string }[]) => {
      console.log(data);
      const questionBoxes = data.map((qa, i) => {
        const div = document.createElement("div");
        div.style.border = "black solid 1px";
        const generatedId = `question${i}`;
        div.id = generatedId;
        // div.textContent = qa.question;
        return {div, text: {question: qa.question, answer: qa.answer}};
      })
      questionBoxes.forEach((questionBox) => { 
        divElement.append(questionBox.div);
        typeWord(questionBox.text.question, questionBox.div)
      });
    })
    .catch((error) => {
      console.log(error);
    })

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