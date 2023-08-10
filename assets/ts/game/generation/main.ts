import {cam} from "../camera";
import {Scene} from "three";
import {setChunkData, loadChunk} from "./chunk";

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
  
  const trees = [];
  trees.push(loadChunk(0, 0));
  trees.push(loadChunk(1, 0));
  trees.push(loadChunk(-1, 0));
  trees.push(loadChunk(0, 1));
  trees.push(loadChunk(1, 1));
  trees.push(loadChunk(-1, 1));
  trees.push(loadChunk(0, -1));
  trees.push(loadChunk(1, -1));
  trees.push(loadChunk(-1, -1));
  
  finishGeneration();
  return {trees};
}