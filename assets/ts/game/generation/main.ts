import {cam} from "../camera";
import {Scene} from "three";
import {setChunkData, loadChunk} from "./chunk";
import {Octree} from "../../lib/quadrant";
import {CameraOctreeMap} from "../../lib/camera";

export const CHUNK_SIZE = 8;

cam.camera.position.x = CHUNK_SIZE / 2;
cam.camera.position.z = CHUNK_SIZE / 2;

// For loading screen
var finishGeneration: () => void;
export const blockArray = new Promise<void>(res => {
  finishGeneration = res;
});

export function generateWorld(scene: Scene) {
  setChunkData({size: CHUNK_SIZE, scene});
  
  const trees: CameraOctreeMap = {};
  trees[0] = (loadChunk(0, 0));
  trees[1] = (loadChunk(1, 0));
  trees[2] = (loadChunk(-1, 0));
  trees[3] = (loadChunk(0, 1));
  trees[4] = (loadChunk(1, 1));
  trees[5] = (loadChunk(-1, 1));
  trees[6] = (loadChunk(0, -1));
  trees[7] = (loadChunk(1, -1));
  trees[8] = (loadChunk(-1, -1));
  
  finishGeneration();
  return {trees};
}