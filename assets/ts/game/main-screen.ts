import {Scene} from "three";
import {setCurrentScene, setCurrentCamera, renderLoop} from "../app";
import {cam} from "./camera";
import {generateWorld} from "./generation/main";
import {newBox} from "../lib/framework";
import {setDebugObj} from "./settings/debug";
import {setTimeScene} from "./time";
import {setDebugScene} from "../lib/quadrant";
import {CoordinateMap2D} from "./generation/voxel-block";
import "./settings/groups";
import {CameraOctreeMap} from "../lib/camera";
import "./ui/main";
import {setSeed} from "./generation/seed";
import {initPlayerBox} from "./player-box";
import "./world-loader";

export const scene = new Scene();
setCurrentScene(scene);
setCurrentCamera(cam.camera);
setTimeScene(scene, cam.camera);
setDebugScene(scene);
setDebugObj(cam);
/*
const worldPr = generateWorld(scene);
worldPr.then(playWorld);
*/

export const camBox = initPlayerBox(scene, cam);
scene.add(camBox);

function playWorld(gworld: CoordinateMap2D<CameraOctreeMap>): void {
  cam.bindPhysics(gworld);
  
  renderLoop();
}
