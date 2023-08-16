import {cam} from "../camera";
import {Scene, CanvasTexture, SRGBColorSpace} from "three";
import {VoxelWorld} from "./chunk";
import {Octree} from "../../lib/quadrant";
import {CameraOctreeMap} from "../../lib/camera";
import {setRenderChunkData} from "./render";
import {CoordinateMap2D} from "./voxel-block";
import {loadImgFromAssets, loadImg} from "../../lib/framework";
import {generateUVMap} from "./blocks";

export const CHUNK_SIZE = 16;

cam.camera.position.x = CHUNK_SIZE / 2;
cam.camera.position.z = CHUNK_SIZE / 2;

// For loading screen
var finishGeneration: () => void;
export const blockArray = new Promise<void>(res => {
  finishGeneration = res;
});


export function generateWorld(scene: Scene): Promise<CoordinateMap2D<CameraOctreeMap>> {
  return new Promise<CoordinateMap2D<CameraOctreeMap>>(res => {
    generateUVMap()
    .then(t => {
      const texture = new CanvasTexture(t);
      texture.colorSpace = SRGBColorSpace;
      const world = new VoxelWorld({
        chunkSize: CHUNK_SIZE,
        scene,
        uv: {
          imageTextures: texture,
          size: 64,
          imageWidth: 64,
          imageHeight: 256,
        },
      });
      
      const trees: CoordinateMap2D<CameraOctreeMap> = 
      new CoordinateMap2D();
      trees.set(0, 0,   world.loadChunk(0, 0)  );
      trees.set(1, 0,   world.loadChunk(1, 0)  );
      trees.set(-1,0,   world.loadChunk(-1, 0) );
      trees.set(0, 1,   world.loadChunk(0, 1)  );
      trees.set(1, 1,   world.loadChunk(1, 1)  );
      trees.set(-1,1,   world.loadChunk(-1, 1) );
      trees.set(0,-1,   world.loadChunk(0, -1) );
      trees.set(1,-1,   world.loadChunk(1, -1) );
      trees.set(-1,-1,  world.loadChunk(-1, -1));
      
      setRenderChunkData(world);
      
      finishGeneration();
      res(trees);
    });
  });
}