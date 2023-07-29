import {createNoise2D} from "../lib/perlin.js";
import {blockData, newBlock} from "./blocks.js";
import {Mesh, Group, Box3, Vector3, Box3Helper} from "three";
import {newBox} from "../lib/framework.js";
import {cam} from "./camera.js";
import {Octree} from "../lib/quadrant.js";
const bd = await blockData;

// Seed: random
const getCoord = createNoise2D();

function getElevation(x, y) {
  x = Math.round(x / 2);
  y = Math.round(y / 2);
  return Math.round((getCoord(x, y) / 2) * 10) / 10;
}

const CHUNK_SIZE = 8;
const grassM = bd.data[bd.name["Grass"]];
const stoneM = bd.data[bd.name["Stone"]];

cam.camera.position.x = CHUNK_SIZE / 2;
cam.camera.position.z = CHUNK_SIZE / 2;

var finishGeneration;
export const blockArray = new Promise(res => {
  finishGeneration = res;
});

export function generateWorld(scene) {
  const blocks = [];
  
  const tree = new Octree({
    width: CHUNK_SIZE,
    height: 5,
    depth: CHUNK_SIZE,
    x: 0,
    y: -7,
    z: 0,
  });
  
  for(let i = 0; i < CHUNK_SIZE; i++) {
    // goes sideways / x-axis
    const yc = i;
    for(let z = 0; z < CHUNK_SIZE; z++) {
      // goes down / y-axis
      const xc = z;
      add_blocks({xc, yc});
    }
  }
  
  function add_block(block) {
    tree.insert({
      x: block.position.x,
      y: block.position.y,
      z: block.position.z,
      width: 1,
      height: 1,
      depth: 1,
    });
    blocks.push(block);
    scene.add(block);
  }
  
  function add_blocks({xc, yc}) {
    const elev = getElevation(xc, yc) - 5;
    const grassBlock = newBlock(grassM);
    
    grassBlock.position.x = xc+0.4;
    grassBlock.position.z = yc+0.4;
    grassBlock.position.y = elev;
    add_block(grassBlock);
    
    const stoneBlock = newBlock(stoneM);
    stoneBlock.position.x = xc+0.4;
    stoneBlock.position.z = yc+0.4;
    stoneBlock.position.y = elev - 1;
    add_block(stoneBlock);
  }
  
  finishGeneration();
  return {tree, blocks};
}