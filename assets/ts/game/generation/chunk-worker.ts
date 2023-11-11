/*
import {XYZ} from "./seed";
import {VoxelContructorOpts, LoadChunkOpts} from "./chunk";
import {CoordinateMap3D} from "./voxel-block";
import {BufferGeometry, Scene, Texture, Mesh, BufferAttribute, DoubleSide, MeshLambertMaterial} from "three";
import {Octree} from "../../lib/quadrant";

type RecieveTypes = "constructor" | "loadPhysics" | "loadChunk";


interface Recieve {
  type: RecieveTypes;
  payload: VoxelContructorOpts | LoadChunkOpts;
}

var CHUNK_SIZE     : number                 ;
var scene          : Scene                  ;
var voxelFaceMap   : CoordinateMap3D<number>;
var imageTextures  : Texture                ;
var tileWidthRatio : number                 ;
var tileHeightRatio: number                 ;

onmessage = function(e: {data: Recieve}) {
  switch(e.data.type) {
    case "constructor": init(<VoxelContructorOpts>e.data.payload)       ; break;
    case "loadPhysics": loadPhysics(<LoadChunkOpts>e.data.payload); break;
    case "loadChunk"  : loadChunk(<LoadChunkOpts>e.data.payload)  ; break;
    default: throw new Error(
      "chunk-worker.ts: "
    + `Recieved invalid type "${e.data.type}"`
    );
  }
};


function init(o: VoxelContructorOpts) {
  CHUNK_SIZE = o.chunkSize;
  scene = o.scene;
  voxelFaceMap = new CoordinateMap3D<number>;
  imageTextures = o.uv.imageTextures;
  tileWidthRatio = o.uv.size / o.uv.imageWidth;
  tileHeightRatio = o.uv.size / o.uv.imageHeight;
}

function loadPhysics(o: LoadChunkOpts) {
  o.chunkY ||= -1;
  const x = o.chunkX * CHUNK_SIZE;
  const y = o.chunkY * CHUNK_SIZE;
  const z = o.chunkZ * CHUNK_SIZE;

  const tree = new Octree({
    width: CHUNK_SIZE,
    height: CHUNK_SIZE,
    depth: CHUNK_SIZE,
    x: x,
    y: y,
    z: z,
  });


  loopChunk(x, z, (xc: number, zc: number) => {
    loadVoxel({xc, zc, y, tree, physics: true});
  });

  // return tree;
}

function loadChunk(o: LoadChunkOpts) {
  o.chunkY ||= -1;
  const x = o.chunkX * CHUNK_SIZE;
  const y = o.chunkY * CHUNK_SIZE;
  const z = o.chunkZ * CHUNK_SIZE;

  const blocksToIterate: XYZ[] = []; 
  loopChunk(x, z, (xc: number, zc: number) => {
    loadVoxel({xc, zc, y, array: blocksToIterate, physics: false});
  });

  const positions: number[] = [];
  const normals:   number[] = [];
  const indices:   number[] = [];
  const uvs:       number[] = [];

  for(const pos of blocksToIterate) {
    findFaces({
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
    map: imageTextures,
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
  geometry.computeVertexNormals();

  const mesh = new Mesh(geometry, material);

  // For chunk deletion
  const blocks: Mesh[] = [];
  blocks.push(mesh);
  mesh.position.x -= 0.1;
  mesh.position.z -= 0.1;

  scene.add(mesh);

  return {tree: null, blocks, hasPhysics: false};
}

function loadVoxel(o: {xc: number, zc: number, y: number, tree?: Octree, array?: XYZ[], physics: boolean}) {
  
}

function addBlockToTree(tree: Octree, pos: XYZ) {
  
}

function findFaces({pos, indices, positions, normals, uvs}: {
  pos:       XYZ;
  indices:   number[];
  positions: number[];
  normals:   number[];
  uvs:       number[];
}) {
  
}

function loopChunk(x: number, y: number, f: (xc: number, yc: number) => void) {
  
}
*/