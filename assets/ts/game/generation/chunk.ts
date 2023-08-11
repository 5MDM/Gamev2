import {blockData, newBlock} from "../blocks";
import {Octree} from "../../lib/quadrant";
import {round, stopLoop, floorMultiple} from "../../lib/util.js";
import {Mesh, Scene, Material} from "three";
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

interface ChunkData {
  xc: number;
  yc: number;
  tree: Octree;
  biome: Biome;
}

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
  
  const blocks: Mesh[] = [];
  
  for(let i = 0; i < CHUNK_SIZE; i++) {
    // goes sideways / x-axis
    const yc = i+y;
    for(let z = 0; z < CHUNK_SIZE; z++) {
      // goes down / y-axis
      const xc = z+x;
      blocks.push(...add_blocks({xc, yc, tree, biome}));
    }
  }
  
  return {tree, blocks};
}

function add_blocks(o: ChunkData): Mesh[] {
  const blockArr: Mesh[] = [];
  const elev = getElevation(o.xc, o.yc) - 5;
  function setPos(block: Mesh) {
    block.position.x = o.xc+0.4;
    block.position.z = o.yc+0.4;
  }
  
  function addBlock(e: Material, y?: number) {
    const block = newBlock(e);
    blockArr.push(block);
    
    setPos(block);
    block.position.y = y || elev;
    addBlockToTree(block, o.tree);
    
    return block;
  }
  
  switch (o.biome) {
    case "plains":
      const grass = addBlock(grassM);
      break;
    case "desert":
      const sand = addBlock(sandM);
  }
  
  const stone = addBlock(stoneM, elev - 1);
  
  return blockArr;
}

function addBlockToTree(block: Mesh, tree: Octree) {
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