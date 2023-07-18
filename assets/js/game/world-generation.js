import {createNoise2D} from "../lib/perlin.js";
import {blockData, newBlock} from "./blocks.js";
import {Mesh, Group, Box3, Vector3, Box3Helper} from "three";
import {newBox} from "../lib/framework.js";
import {cam} from "./camera.js";
import {Quadtree} from "../lib/quadrant.js";
const bd = await blockData;

// Seed: 0
const getCoord = createNoise2D();

function getElevation(x, y) {
  x = Math.round(x / 2);
  y = Math.round(y / 2);
  return Math.round((getCoord(x, y) / 3) * 10) / 10;
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
  const treeBox = new Box3(
    new Vector3(0.5, -7, 0.5),
    new Vector3(CHUNK_SIZE+0.5, -4, CHUNK_SIZE+0.5),
  );
  
  const tree = new Quadtree(treeBox);
  
  var color = Math.random() * 0xffffff;
  
  for(let i = CHUNK_SIZE; i > 0; i--) {
    // goes sideways / x-axis
    const yc = i;
    for(let z = CHUNK_SIZE; z > 0; z--) {
      // goes down / y-axis
      const xc = z;
      add_blocks({xc, yc});
    }
  }
  
  function add_block(block) {
    tree.insert(new Box3().setFromObject(block));
    blocks.push(block);
    scene.add(block);
  }
  
  function add_blocks({xc, yc}) {
    const elev = getElevation(xc, yc) - 5;
    //const grassBlock = newBlock(grassM);
    const grassBlock = newBox({color, size: 1});
    
    grassBlock.position.x = xc;
    grassBlock.position.z = yc;
    grassBlock.position.y = elev;
    add_block(grassBlock);
    
    //const stoneBlock = newBlock(stoneM);
    const stoneBlock = newBox({color, size: 1});
    stoneBlock.position.x = xc;
    stoneBlock.position.z = yc;
    stoneBlock.position.y = elev - 1;
    // world[yc][xc][elev - 1] = stoneBlock;
    add_block(stoneBlock);
  }
  
  finishGeneration();
  return {tree, blocks};
}