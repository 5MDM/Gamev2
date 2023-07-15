import {newCamera, newBox, newBoxGeometry, loadImg} from "../lib/framework.js";
import {Scene, MeshBasicMaterial, Mesh} from "three";
import {setCurrentScene, setCurrentCamera, renderLoop} from "../app.js";
import {stopLoop, $} from "../lib/util.js";
import {ControlCamera} from "../lib/camera.js";
import {cam} from "./camera.js";

const scene = new Scene();
setCurrentScene(scene);
setCurrentCamera(cam.camera);

const boxG = newBoxGeometry(1);
const material = new MeshBasicMaterial({
  map: await loadImg("/assets/images/game/grass.png"),
  //color: 0xffffff,
});
const block = new Mesh(boxG, material);

scene.add(block);

stopLoop(() => {
  block.rotation.x += 0.01;
  block.rotation.z += 0.02;
});

cam.camera.position.z = 5;

renderLoop();
