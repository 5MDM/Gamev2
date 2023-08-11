import {gameState} from "../../window";
import {stopLoop, floorMultiple} from "../../lib/util";
import {CHUNK_SIZE} from "./main";
import {cam} from "../camera";
import {Scene} from "three";

var scene: Scene;
export function setRenderScene(s: Scene) {
  scene = s;
}

const counterOg: number = 200;
var counter: number = counterOg;

function deleteIfOutRadius(r: number) {
  const x = 
  floorMultiple(cam.camera.position.x, CHUNK_SIZE) / 8;
  const y = 
  floorMultiple(cam.camera.position.z, CHUNK_SIZE) / 8;
  
  for(const i in cam.octrees) {
    const coord = i.split(",");
    const cx = parseInt(coord[0]);
    const cy = parseInt(coord[1]);
    
    if(!(cx <= x + r
    && cx >= x - r
    && cy <= y + r
    && cy >= y - r)) {
      // delete chunk
      for(const z in cam.octrees[i].blocks)
        scene.remove(cam.octrees[i].blocks[z]);
      
      delete cam.octrees[i];
    }
  }
  
  console.log(cam.octrees);
}

export const chunkRenderLoop = stopLoop(() => {
  if(counter-- <= 0) {
    counter = counterOg;
    const {renderDistance} = gameState;
    deleteIfOutRadius(renderDistance);
  }
}, false);