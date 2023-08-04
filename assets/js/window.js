export const canvasPaddingHeight = 50;
export const canvasPaddingWidth = 10;
export const canvasWidth = innerWidth - canvasPaddingWidth;
export const canvasHeight = innerHeight - canvasPaddingHeight;
export function isTouchDevice() {
  return (("ontouchstart" in window) ||
     (navigator.maxTouchPoints > 0) ||
     (navigator.msMaxTouchPoints > 0));
}
export function supportsPointerLock() {
  return "pointerLockElement" in document
}
export const gameState = {
  paused: false,
  fps: NaN,
  showControls: isTouchDevice(),
  devToolsEnabled: false,
};

addEventListener("touchend", e => e.preventDefault());

document.documentElement.style
.setProperty("--w", innerWidth + "px");
document.documentElement.style
.setProperty("--h", innerHeight + "px");

document.documentElement.style
.setProperty("--cw", canvasWidth + "px");
document.documentElement.style
.setProperty("--ch", canvasHeight + "px");