import {createNoise2D} from "../lib/perlin.js";
import {blockData, newBlock} from "./blocks.js";
import {Mesh, Group, Box3, Vector3, Box3Helper} from "three";
import {newBox} from "../lib/framework.js";
import {cam} from "./camera.js";
import {Octree} from "../lib/quadrant.js";
import {aleaPRNG} from "../lib/alea.js";
const bd = await blockData;

// Seed: random
const seedM = 10000;
const seed = Math.round(Math.random() * seedM) / seedM;
const getCoord = createNoise2D(() => seed);
const random = aleaPRNG(seed);

function getElevation(x, y) {
  function e(a) {
    return getCoord(x*a, y*a);
  }
  /*x = Math.round(x / 2);
  y = Math.round(y / 2);*/
  return Math.floor(e(0.1) * 2) / 2;
}

const CHUNK_SIZE = 8;
const grassM = bd.data[bd.name["Grass"]];
const sandM = bd.data[bd.name["Sand"]];
const stoneM = bd.data[bd.name["Stone"]];

cam.camera.position.x = CHUNK_SIZE / 2;
cam.camera.position.z = CHUNK_SIZE / 2;

var finishGeneration;
export const blockArray = new Promise(res => {
  finishGeneration = res;
});

export function generateWorld(scene) {
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
  
  function add_block(block, tree) {
    tree.insert({
      x: block.position.x,
      y: block.position.y,
      z: block.position.z,
      width: 1,
      height: 1,
      depth: 1,
    });
    
    scene.add(block);
  }
  
  function add_blocks({xc, yc, tree, biome}) {
    const elev = getElevation(xc, yc) - 5;
    function setPos(e) {
      e.position.x = xc+0.4;
      e.position.z = yc+0.4;
    }
    
    if(biome == "plains") {
      const grassBlock = newBlock(grassM);
      setPos(grassBlock);
      grassBlock.position.y = elev;
      add_block(grassBlock, tree);
    } else if(biome == "desert") {
      const sandBlock = newBlock(sandM);
      setPos(sandBlock);
      sandBlock.position.y = elev;
      add_block(sandBlock, tree);
    }
    
    const stoneBlock = newBlock(stoneM);
    setPos(stoneBlock);
    stoneBlock.position.y = elev - 1;
    add_block(stoneBlock, tree);
  }
  
  function loadChunk(chunkX, chunkY) {
    const x = chunkX * CHUNK_SIZE;
    const y = chunkY * CHUNK_SIZE;
    const biomeId = random.range(15);
    var biome = "plains";
    /*if(biomeId >= 7
    && biomeId <= 10) {
      biome = "desert";
    } else if(biomeId <= 3) {
      // cave opening
      biome = "";
    }*/
    
    const tree = new Octree({
      width: CHUNK_SIZE,
      height: 5,
      depth: CHUNK_SIZE,
      x: x,
      y: -7,
      z: y,
    });
    
    for(let i = 0; i < CHUNK_SIZE; i++) {
      // goes sideways / x-axis
      const yc = i+y;
      for(let z = 0; z < CHUNK_SIZE; z++) {
        // goes down / y-axis
        const xc = z+x;
        add_blocks({xc, yc, tree, biome});
      }
    }
    
    return tree;
  }
  
  finishGeneration();
  return {trees};
}
