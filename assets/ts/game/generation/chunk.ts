import {Octree} from "../../lib/quadrant";
import {round, stopLoop, floorMultiple, rand} from "../../lib/util.js";
import {Mesh, Scene, Material, MeshLambertMaterial, BufferGeometry, BufferAttribute, MeshBasicMaterial, AmbientLight, Texture, DoubleSide, CanvasTexture, NearestFilter, NearestMipmapNearestFilter} from "three";
import {seed, getElevation} from "./seed";
import {CoordinateMap3D, faces} from "./voxel-block";
import {loadImgFromAssets} from "../../lib/framework";
import {renderer} from "../../app";

interface VoxelContructorOpts {
  chunkSize: number;
  scene: Scene;
  uv: {
    imageTextures: Texture;
    size: number;
    imageWidth: number;
    imageHeight: number;
  };
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

export class VoxelWorld {
  CHUNK_SIZE: number;
  scene: Scene;
  voxelFaceMap: CoordinateMap3D<boolean>;
  imageTextures: Texture;
  tileWidthRatio: number;
  tileHeightRatio: number;
  
  constructor(o: VoxelContructorOpts) {
    this.CHUNK_SIZE = o.chunkSize;
    this.scene = o.scene;
    this.voxelFaceMap = new CoordinateMap3D<boolean>;
    this.imageTextures = o.uv.imageTextures;
    this.tileWidthRatio = o.uv.size / o.uv.imageWidth;
    this.tileHeightRatio = o.uv.size / o.uv.imageHeight;
    
    const light = new AmbientLight(0x404040, 100);
    this.scene.add(light);
    
    this.imageTextures.magFilter = NearestFilter;
    this.imageTextures.minFilter = NearestMipmapNearestFilter;
    this.imageTextures.anisotropy = 
    renderer.capabilities.getMaxAnisotropy();
    
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
      height: 5,
      depth: this.CHUNK_SIZE,
      x: x,
      y: -7,
      z: y,
    });
    
    const blocksToIterate: XYZ[] = []; 
    this.loopChunk(x, y, (xc, yc) => {
      this.loadVoxel({xc, yc, tree, array: blocksToIterate});
    });
    
    const positions: number[] = [];
    const normals:   number[] = [];
    const indices:   number[] = [];
    const uvs:       number[] = [];
    
    for(const pos of blocksToIterate) {
      //voxelFaceMap.set()
      this.findFaces({
        pos,
        positions,
        normals,
        indices,
        uvs,
      });
    }
    
    const geometry = new BufferGeometry();
    
    const material = 
    new MeshLambertMaterial({
      map: this.imageTextures,
      side: DoubleSide,
      transparent: true,
    });
    
    const positionNumComponents = 3;
    const normalNumComponents = 3;
    geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(positions), 3),
    );
    
    geometry.setAttribute(
      "normal",
      new BufferAttribute(new Float32Array(normals), 3),
    );
    
    geometry.setAttribute(
      "uv",
      new BufferAttribute(new Float32Array(uvs), 2),
    );
    
    geometry.setIndex(indices);
    //geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    
    const mesh = new Mesh(geometry, material);
    
    // For chunk deletion
    const blocks: Mesh[] = [];
    blocks.push(mesh);
    mesh.position.x -= 0.1;
    mesh.position.z -= 0.1;
    
    this.scene.add(mesh);
    
    return {tree, blocks};
  }
  
  protected loadVoxel(o: {xc: number, yc: number, tree: Octree, array: XYZ[]}): void {
    const elev = getElevation(o.xc, o.yc) - 5;
    const pos: XYZ = {x: o.xc, y: elev, z: o.yc};
    
    this.addBlockToTree(o.tree, pos);
    o.array.push(pos);
    
    this.voxelFaceMap.set(pos.x, pos.y, pos.z, true);
  }
  
  /*protected add_blocks(o: ChunkData): Mesh[] {
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
  }*/
  
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
  
  protected loopChunk(x: number, y: number, f: (xc: number, yc: number) => void): void {
    
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
  
  protected findFaces({pos, indices, positions, normals, uvs}: {
    pos:       XYZ;
    indices:   number[];
    positions: number[];
    normals:   number[];
    uvs:       number[];
  }): void {
    
    // TODO
    const uvVoxel = 0;
    for(const {dir, corners, uvRow} of faces) {
      const neighbor = this.voxelFaceMap.get(
        pos.x + dir[0],
        pos.y + dir[1],
        pos.z + dir[2],
      );
      
      if(neighbor == undefined) {
        // make face
        const ndx = positions.length / 3;
        for(const p of corners) {
          positions.push(
            p.pos[0] + pos.x, 
            p.pos[1] + pos.y,
            p.pos[2] + pos.z,
          );
          normals.push(...dir);
          
          uvs.push(
            (uvVoxel + p.uv[0]) * this.tileWidthRatio,
            1 - (uvRow + 1 - p.uv[1]) * this.tileHeightRatio,
          );
        }
        
        indices.push(
          ndx    , ndx + 1, ndx + 2,
          ndx + 2, ndx + 1, ndx + 3,
        );
      }
    }
    
  }
}
