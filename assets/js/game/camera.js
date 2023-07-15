import {MovementCamera} from "../lib/camera.js";
import {$, clamp, stopLoop} from "../lib/util.js";

export const cam = new MovementCamera();
cam.bind($("#c"));
cam.setDefault(0, 0);
cam.enable();

cam.onPointerMove = function(e) {
  cam.rx += e.x * 0.01;
  cam.ry = clamp(
    -Math.PI / 3,
    cam.ry + (e.y * 0.01),
     Math.PI / 3,
  );
};

const up = stopLoop(() => cam.moveUp(), false);
const left = stopLoop(() => cam.moveLeft(), false);
const down = stopLoop(() => cam.moveDown(), false);
const right = stopLoop(() => cam.moveRight(), false);

$("#ui > #gui > #movement #up")
.addEventListener("pointerdown", e => up.start());

$("#ui > #gui > #movement #up")
.addEventListener("pointerup", e => up.stop());

$("#ui > #gui > #movement #left")
.addEventListener("pointerdown", e => left.start());

$("#ui > #gui > #movement #left")
.addEventListener("pointerup", e => left.stop());

$("#ui > #gui > #movement #down")
.addEventListener("pointerdown", e => down.start());

$("#ui > #gui > #movement #down")
.addEventListener("pointerup", e => down.stop());

$("#ui > #gui > #movement #right")
.addEventListener("pointerdown", e => right.start());

$("#ui > #gui > #movement #right")
.addEventListener("pointerup", e => right.stop());

$("#ui > #gui > #movement")
.addEventListener("gesturestart", e => e.preventDefault());

$("#ui > #gui > #movement")
.addEventListener("touchstart", e => e.preventDefault());