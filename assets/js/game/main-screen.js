import {Scene} from "three";
import {setCurrentScene, setCurrentCamera, renderLoop} from "../app.js";
import {cam} from "./camera.js";
import {generateWorld} from "./world-generation.js";
import {newBox} from "../lib/framework.js";
import {setDevObj} from "./settings/main.js";
import {setTimeScene} from "./time.js";

import {blockData} from "./blocks.js";
const bd = await blockData;

export const scene = new Scene();
setCurrentScene(scene);
setCurrentCamera(cam.camera);
setTimeScene(scene, cam.camera);
// setDebugScene(scene);

const gworld = generateWorld(scene);
cam.bindPhysics(gworld);
//cam.enableGravity();
renderLoop();

// player
export const camBox = newBox({
  width: 0.2,
  height: 3,
  depth: 0.2,
  color: 0xf0f0f0,
});
scene.add(camBox);
cam.bindPlayer(camBox);

camBox.position.x = cam.camera.position.x;
camBox.position.y = cam.camera.position.y-2.5;
camBox.position.z = cam.camera.position.z;

cam.onMove = function(s) {
  camBox.position.x = cam.camera.position.x;
  camBox.position.y = cam.camera.position.y-2.5;
  camBox.position.z = cam.camera.position.z;
  return s;
};

setDevObj({
  camera: cam,
  player: camBox,
  octrees: gworld,
});