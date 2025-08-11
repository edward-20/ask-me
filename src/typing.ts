export function clearContent(htmlElement: Element) {
  htmlElement.textContent = "";
}

export type typeWord = {
  (text: string, htmlElement: Element, callbackFn?: () => void): void,
  intervals: number[]
}

const typeWord = ((text: string, htmlElement: Element, callbackFn?: () => void) =>
{
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
      if (callbackFn)
      setTimeout(callbackFn, 1000);
    }
  }, 25);

  if (typeWord.intervals) {
    typeWord.intervals.push(interval)
  } else {
    typeWord.intervals = [];
  }
}) as typeWord;

export { typeWord };