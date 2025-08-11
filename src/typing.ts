export function clearContent(htmlElement: Element) {
  htmlElement.textContent = "";
}

export type typeWord = {
  (text: string, htmlElement: Element): void,
  intervals: number[]
}

const typeWord = ((text: string, htmlElement: Element) =>
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
    }
  }, 25);

  if (typeWord.intervals) {
    typeWord.intervals.push(interval)
  } else {
    typeWord.intervals = [];
  }
}) as typeWord;

export { typeWord };