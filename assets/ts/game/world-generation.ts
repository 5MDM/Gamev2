import {createNoise2D} from "../lib/perlin";
import {blockData, newBlock} from "./blocks";
import {cam} from "./camera";
import {Octree} from "../lib/quadrant";
import {round, stopLoop} from "../lib/util.js";
import {Mesh, Scene} from "three";
import {gameState} from "../window.js";
const bd = await blockData;

type Biome = "plains" | "desert";

// Seed: random
const seedM = 10000;
const seed = round(Math.random(), seedM);
const getCoord = createNoise2D(() => seed);
// const random = aleaPRNG(seed);

function getElevation(x: number, y: number) {
  function e(a: number) {
    return getCoord(x*a, y*a);
  }
  
  return Math.floor(e(0.1) * 2) / 2;
}

const CHUNK_SIZE = 8;
const grassM = bd.data[bd.name["Grass"]];
const sandM = bd.data[bd.name["Sand"]];
const stoneM = bd.data[bd.name["Stone"]];

cam.camera.position.x = CHUNK_SIZE / 2;
cam.camera.position.z = CHUNK_SIZE / 2;

var finishGeneration: () => void;
export const blockArray = new Promise<void>(res => {
  finishGeneration = res;
});

const chunkList: {
  [key: number]: {
    [key: number]: boolean;
  }
} = {};

function getChunk(x: number, y: number) {
  return chunkList[y][x];
}

function changeLoadedChunk(x: number, y: number, e: boolean) {
  chunkList[y][x] = e;
}

function checkIfInDistance() {
  const d = gameState.renderDistance;
  const x = Math.round(cam.camera.position.x);
  const y = Math.round(cam.camera.position.y);
  console.log({x, y});
}

function whatToGenerate() {
  stopLoop(() => {
    checkIfInDistance();
  });
}

export function generateWorld(scene: Scene) {
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
  
  function add_block(block: Mesh, tree: Octree) {
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
  
  function add_blocks({xc, yc, tree, biome}: {xc: number, yc: number, tree: Octree, biome: Biome}) {
    const elev = getElevation(xc, yc) - 5;
    function setPos(block: Mesh) {
      block.position.x = xc+0.4;
      block.position.z = yc+0.4;
    }
    
    switch (biome) {
      case "plains":
        const grassBlock = newBlock(grassM);
        setPos(grassBlock);
        grassBlock.position.y = elev;
        add_block(grassBlock, tree);
        break;
      case "desert":
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
  
  function loadChunk(chunkX: number, chunkY: number) {
    changeLoadedChunk(chunkX, chunkY, true);
    
    const x = chunkX * CHUNK_SIZE;
    const y = chunkY * CHUNK_SIZE;
    var biome: Biome = "plains";
    
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
  whatToGenerate();
  return {trees};
}