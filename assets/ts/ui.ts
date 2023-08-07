import {gameState, isTouchDevice} from "./window";
import {$, wait} from "./lib/util";
import {renderer} from "./app";
import {cam} from "./game/camera";

if(isTouchDevice()) {
  $("#ui > #gui > #movement")!.style.display = "flex";
  $("#ui > #gui > #v-movement")!.style.display = "flex";
}

export function updateCanvasSize() {
  const width = window.innerWidth - gameState.canvas.paddingWidth;
  const height = window.innerHeight - gameState.canvas.paddingHeight;
  gameState.canvas.width = width;
  gameState.canvas.height = height;
  cam.camera.aspect = width / height;
  cam.camera.updateProjectionMatrix();
  renderer.setSize(width, height);

  document.documentElement.style
  .setProperty("--w", window.innerWidth + "px");
  document.documentElement.style
  .setProperty("--h", window.innerHeight + "px");
  document.documentElement.style
  .setProperty("--cw", gameState.canvas.width + "px");
  document.documentElement.style
  .setProperty("--ch", gameState.canvas.height + "px");
}

window.addEventListener("resize", async () => {
  await wait(50);
  updateCanvasSize();
})