import { useRef, useEffect } from "preact/hooks";
import { html } from "htm/preact";

export function clearContent(htmlElement: Element) {
  htmlElement.textContent = "";
}
export function typeWord(text: string, htmlElement: Element) {
  // let i = 0;
  // setInterval(() => {
  //   htmlElement.textContent += text[i];
  //   i++;
  // }, 50)
  let i = 0;
  const interval = setInterval(() => {
    htmlElement.textContent += text[i];
    i++;

    if (i >= text.length) {
      clearInterval(interval);
    }
  }, 50);
}
export function Typewriter({ text, className } : { text: string, className: string }) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (spanRef.current) {
      spanRef.current.textContent = ""; // Clear initial content
      spanRef.current.className = className;
      typeWord(text, spanRef.current);
    }
  }, [text]);

  return html`<span ref=${spanRef}></span>`;
}