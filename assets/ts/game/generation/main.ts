import {cam} from "../camera";
import {Scene} from "three";
import {setChunkData, loadChunk} from "./chunk";
import {Octree} from "../../lib/quadrant";
import {CameraOctreeMap} from "../../lib/camera";
import {chunkRenderLoop, setRenderScene} from "./render";

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
  trees["0,0"] = (loadChunk(0, 0));
  trees["1,0"] = (loadChunk(1, 0));
  trees["-1,0"] = (loadChunk(-1, 0));
  trees["0,1"] = (loadChunk(0, 1));
  trees["1,1"] = (loadChunk(1, 1));
  trees["-1,1"] = (loadChunk(-1, 1));
  trees["0,-1"] = (loadChunk(0, -1));
  trees["1,-1"] = (loadChunk(1, -1));
  trees["-1,-1"] = (loadChunk(-1, -1));
  setRenderScene(scene);
  chunkRenderLoop.start();
  
  finishGeneration();
  return trees;
}