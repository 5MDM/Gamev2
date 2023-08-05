export const canvasPaddingHeight = 50;
export const canvasPaddingWidth = 10;
export const canvasWidth = innerWidth - canvasPaddingWidth;
export const canvasHeight = innerHeight - canvasPaddingHeight;

export function isPWA() {
  const str = "(display-mode: standalone)";
  if(navigator.standalone 
  || matchMedia(str).matches) 
    return true;
  
  return false;
}

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
  isInstalled: isPWA(),
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

if(!gameState.showControls) {
  document.getElementById("m-start-game")
  .onpointerdown = enableFullscreen;
}

function enableFullscreen() {
  const el = document.documentElement;
  const rfs = el.requestFullscreen
  || el.webkitRequestFullScreen
  || el.mozRequestFullScreen
  || el.msRequestFullscreen;
  
  if(rfs != undefined){
    rfs.call(el);
  } else {
    alert("Your browser does not support fullscreen");
  }
}