
// stop the animation
// remove event listeners for mouse move and mouse down
import * as THREE from "three";
import gsap from "gsap";
import type { Mode } from "../mode";
import { typeWord } from "../typing";
import type { EventListener } from "../eventListener";

export class ConversationMode implements Mode {
  name = "Conversation";
  camera: THREE.Camera;
  eventListeners: EventListener[];
  constructor(camera : THREE.Camera, eventListeners: EventListener[]) {
    this.camera = camera;
    this.eventListeners = eventListeners;
  }

  _showQuestions(container: HTMLElement) {
    fetch("http://localhost:5000/")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parse JSON body
    })
    .then((data : { question: string, answer: string }[]) => {
      console.log(data);
      // create array of objects containing the dom node for the question and the question data
      const questionBoxes = data.map((qa, i) => {
        const questionButton = document.createElement("button");
        questionButton.className = "question";
        const generatedId = `question${i}`;
        questionButton.id = generatedId;
        return {domNode: questionButton, text: {question: qa.question, answer: qa.answer}};
      })
      questionBoxes.forEach((questionBox) => { 
        // for each of the objects in the array 
        // attach the DOM node and type out the question 
        container.append(questionBox.domNode);
        typeWord(`>${questionBox.text.question}`, questionBox.domNode)
        // add an event listener to each button
        questionBox.domNode.addEventListener("click", (event) => {
          // before changing the state of something, clear all current attempts to finish typing words
          typeWord.intervals.forEach((intervalId) => {
            clearInterval(intervalId);
          })
          // change the message to the question and type it
          const message = document.getElementsByClassName("message")[0]
          message.textContent = "";
          typeWord(questionBox.text.question, message);
          // remove all other question class DOM elements
          Array.from(document.getElementsByClassName("question")).forEach(element => {
            element.remove();
          });
          const answer = document.createElement("div");
          answer.className = "answer";
          const info = document.getElementsByClassName("info")[0];
          info.appendChild(answer);
          typeWord(questionBox.text.answer, answer);
        })
      });
    })
    .catch((error) => {
      console.log(error);
    })


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

    this._showQuestions(divElement);

    this.eventListeners.forEach((eventListener) => {
      // this is a kludge, we should be somehow taking the list of eventListeners and finding the one that's relevant to the exitButton
      if (eventListener.event === "mousedown") { // handling exit attempt
        (document.getElementsByClassName("exit")[0] as HTMLElement).addEventListener(eventListener.event, eventListener.listener)
      }
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