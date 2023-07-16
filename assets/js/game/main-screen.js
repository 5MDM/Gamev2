import {newCamera, newBox, newBoxGeometry, loadImg} from "../lib/framework.js";
import {Scene, MeshBasicMaterial, Mesh} from "three";
import {setCurrentScene, setCurrentCamera, renderLoop} from "../app.js";
import {stopLoop, $} from "../lib/util.js";
import {ControlCamera} from "../lib/camera.js";
import {cam} from "./camera.js";
import {generateWorld} from "./world-generation.js";

import {blockData, blockGeometry} from "./blocks.js";
const bd = await blockData;

export const scene = new Scene();
setCurrentScene(scene);
setCurrentCamera(cam.camera);

generateWorld(scene);

renderLoop();
