import {Scene} from "three";
import {setCurrentScene, setCurrentCamera, renderLoop} from "../app.js";
import {cam} from "./camera.js";
import {generateWorld} from "./world-generation.js";

import {blockData, blockGeometry} from "./blocks.js";
const bd = await blockData;

export const scene = new Scene();
setCurrentScene(scene);
setCurrentCamera(cam.camera);

const world = generateWorld(scene);
cam.bindPhysics(world);

renderLoop();
