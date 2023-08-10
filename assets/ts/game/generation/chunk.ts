import {blockData, newBlock} from "../blocks";
import {Octree} from "../../lib/quadrant";
import {round, stopLoop, floorMultiple} from "../../lib/util.js";
import {Mesh, Scene} from "three";
import {seed, getElevation} from "./seed";
const bd = await blockData;

var CHUNK_SIZE: number;
var scene: Scene;

export function setChunkData(o: {size: number, scene: Scene}) {
  CHUNK_SIZE = o.size;
  scene = o.scene;
}

type Biome = "plains" | "desert";
const grassM = bd.data[bd.name["Grass"]];
const sandM = bd.data[bd.name["Sand"]];
const stoneM = bd.data[bd.name["Stone"]];

export function loadChunk(chunkX: number, chunkY: number) {
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
  
  return tree;
}