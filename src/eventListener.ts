export interface EventListener {
  event: "mousedown" | "mousemove", // maybe include other mouse events
  listener: (event: MouseEvent) => void
}