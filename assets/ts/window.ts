import {generateUVMap} from "./game/generation/blocks";

export function isPWA() {
  const str = "(display-mode: standalone)";
  if(('standalone' in navigator) && navigator.standalone
  || matchMedia(str).matches) 
    return true;
  
  return false;
}

export function isTouchDevice() {
  return (("ontouchstart" in window) ||
     (navigator.maxTouchPoints > 0));
}
export function supportsPointerLock() {
  return "pointerLockElement" in document
}

export function isiOSDevice() {
  return /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) && !(window as any).MSStream;
}

interface GameStateInterface {
  paused: boolean;
  fps: number;
  showControls: boolean;
  isInstalled: boolean;
  devToolsEnabled: boolean;
  canvas: {
    paddingWidth: number;
    paddingHeight: number;
    width: number;
    height: number;
  };
  useFullScreen: boolean;
  renderDistance: number;
}

export const gameState: GameStateInterface = {
  paused: false,
  fps: NaN,
  showControls: isTouchDevice(),
  isInstalled: isPWA(),
  devToolsEnabled: false,
  canvas: {
    paddingWidth: 0,
    paddingHeight: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  useFullScreen: !isiOSDevice(),
  renderDistance: 2
};

gameState.canvas.width = window.innerWidth - gameState.canvas.paddingWidth;
gameState.canvas.height = window.innerHeight - gameState.canvas.paddingHeight;

export const imageImports: {[key: string]: () => Promise<{default: string}>} = Object.fromEntries(
  Object.entries(
    import.meta.glob<{default: string}>("../images/**"))
      .map(([key, value]) => [key.slice(10), value]
    )
  )

addEventListener("touchend", e => e.preventDefault());

document.documentElement.style
.setProperty("--w", window.innerWidth + "px");
document.documentElement.style
.setProperty("--h", window.innerHeight + "px");

document.documentElement.style
.setProperty("--cw", gameState.canvas.width + "px");
document.documentElement.style
.setProperty("--ch", gameState.canvas.height + "px");

export function enableFullscreen() {
  if (!gameState.useFullScreen) return;
  const el = document.documentElement;
  const rfs = el.requestFullscreen
  || el.webkitRequestFullScreen
  || el.mozRequestFullScreen
  || el.msRequestFullscreen;
  
  if(!rfs) return
  rfs.call(el);
}