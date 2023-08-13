import {blockData, newBlock} from "./blocks";
import {Octree} from "../../lib/quadrant";
import {round, stopLoop, floorMultiple} from "../../lib/util.js";
import {Mesh, Scene, Material} from "three";
import {seed, getElevation} from "./seed";
const bd = await blockData;

interface VoxelContructorOpts {
  chunkSize: number;
  scene: Scene;
}

interface ChunkData {
  xc: number;
  yc: number;
  tree: Octree;
  biome: Biome;
}

interface XYZ {
  x: number;
  y: number;
  z: number;
}

type Biome = "plains" | "desert";
const grassM = bd.data[bd.name["Grass"]];
const sandM = bd.data[bd.name["Sand"]];
const stoneM = bd.data[bd.name["Stone"]];

export class VoxelWorld {
  CHUNK_SIZE: number;
  scene: Scene;
  
  constructor(o: VoxelContructorOpts) {
    this.CHUNK_SIZE = o.chunkSize;
    this.scene = o.scene;
    return this;
  }
  
  loadChunk(chunkX: number, chunkY: number): {
    tree: Octree;
    blocks: Mesh[];
  } {
    const x = chunkX * this.CHUNK_SIZE;
    const y = chunkY * this.CHUNK_SIZE;
    var biome: Biome = "plains";
    
    const tree = new Octree({
      width: this.CHUNK_SIZE,
      height: this.CHUNK_SIZE / 2, // 5
      depth: this.CHUNK_SIZE,
      x: x,
      y: -this.CHUNK_SIZE / 2, // -7,
      z: y,
    });
    
    const blocksToIterate: XYZ[] = []; 
    this.loopChunk(x, y, (xc, yc) => {
      this.loadVoxel({xc, yc, tree, array: blocksToIterate});
    });
    
    // For chunk deletion
    const blocks: Mesh[] = [];
    
    /*loopChunk((xc, yc) => {
      blocks.push(...add_blocks({xc, yc, tree, biome}));
    });*/
    
    return {tree, blocks};
  }
  
  protected loadVoxel(o: {xc: number, yc: number, tree: Octree, array: XYZ[]}): void {
    const elev = getElevation(o.xc, o.yc) - 5;
    const pos: XYZ = {x: o.xc+0.4, y: elev, z: o.yc+0.4};
    
    this.addBlockToTree(o.tree, pos);
    
    o.array.push(pos);
  }
  
  protected add_blocks(o: ChunkData): Mesh[] {
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
      //addBlockToTree(block, o.tree);
      
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
  
  protected addBlockToTree(tree: Octree, pos: XYZ): void {
    tree.insert({
      x: pos.x,
      y: pos.y,
      z: pos.z,
      width: 1,
      height: 1,
      depth: 1,
    });
  }
  
  loopChunk(x: number, y: number, f: (xc: number, yc: number) => void): void {
    for(let i = 0; i < this.CHUNK_SIZE; i++) {
      // goes sideways / x-axis
      const yc = i+y;
      for(let z = 0; z < this.CHUNK_SIZE; z++) {
        // goes down / y-axis
        const xc = z+x;
        f(xc, yc);
      }
    }
  }
}
