import {createNoise2D} from "../lib/perlin.js";
import {blockData, newBlock} from "./blocks.js";
import {Mesh} from "three";
const bd = await blockData;

// Seed: 0
const getCoord = createNoise2D();

function getElevation(x, y) {
  x = Math.round(x / 2);
  y = Math.round(y / 2);
  return (Math.round(getCoord(x, y) * 10) / 10) / 3;
}

const CHUNK_SIZE = 10;
const grassM = bd.data[bd.name["Grass"]];
const stoneM = bd.data[bd.name["Stone"]];

var finishGeneration;
export const blockArray = new Promise(res => {
  finishGeneration = res;
});

function worldLog(world) {
  var y = 0;
  var x;
  var lx;
  
  for(const i in world) {
    for(const z in world[i]) {
      const yy = Object.keys(world[i][z]).length;
      if(y < yy) y = yy;
    }
    
    lx = x;
    x = Object.keys(world[i]).length;
    
    if(lx != undefined)
      if(lx != x) console.warn("World error");
  }
  
  console.log(
    `Width: ${x}\n`
  + `Max height: ${y}\n`
  + `Length: ${Object.keys(world).length}`
  );
}

export function generateWorld(scene) {
  const arr = [];
  const world = {};
  
  for(let i = CHUNK_SIZE; i >= 0; i--) {
    // goes sideways / x-axis
    const yc = i - CHUNK_SIZE / 2;
    world[yc] = {};
    
    for(let z = CHUNK_SIZE; z >= 0; z--) {
      // goes down / y-axis
      
      const xc = z - CHUNK_SIZE / 2;
      world[yc][xc] = {};
      const elev = getElevation(xc, yc) - 5;
      const grassBlock = newBlock(grassM);
      
      grassBlock.position.x = xc;
      grassBlock.position.z = yc;
      grassBlock.position.y = elev;
      world[yc][xc][elev] = grassBlock;
      scene.add(grassBlock);
      
      const stoneBlock = newBlock(stoneM);
      stoneBlock.position.x = xc;
      stoneBlock.position.z = yc;
      stoneBlock.position.y = elev - 1;
      world[yc][xc][elev - 1] = stoneBlock;
      scene.add(stoneBlock);
    }
  }
  
  worldLog(world);
  
  finishGeneration();
}