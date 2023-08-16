import {Scene} from "three";
import {setCurrentScene, setCurrentCamera, renderLoop} from "../app";
import {cam} from "./camera";
import {generateWorld} from "./generation/main";
import {newBox} from "../lib/framework";
import {setDevObj} from "./settings/main";
import {setTimeScene} from "./time";
import {setDebugScene} from "../lib/quadrant";
import {CoordinateMap2D} from "./generation/voxel-block";
import "./settings/groups";
import {CameraOctreeMap} from "../lib/camera";

export const scene = new Scene();
setCurrentScene(scene);
setCurrentCamera(cam.camera);
setTimeScene(scene, cam.camera);
//setDebugScene(scene);

const worldPr = generateWorld(scene);
worldPr.then(main);

export const camBox = newBox({
  width: 0.2,
  height: 3,
  depth: 0.2,
  color: 0xf0f0f0,
});

function main(gworld: CoordinateMap2D<CameraOctreeMap>): void {
  cam.bindPhysics(gworld);
  
  setDevObj({
    camera: cam,
    player: camBox,
    octrees: gworld,
  });
  
  scene.add(camBox);
  cam.bindPlayer(camBox);
  
  camBox.position.x = cam.camera.position.x;
  camBox.position.y = cam.camera.position.y-2.5;
  camBox.position.z = cam.camera.position.z;
  
  cam.onMove = function() {
    camBox.position.x = cam.camera.position.x;
    camBox.position.y = cam.camera.position.y-2.5;
    camBox.position.z = cam.camera.position.z;
  };
  
  renderLoop();
}
//cam.enableGravity();

// player