import {createNoise2D} from "../lib/perlin.js";
import {blockData, newBlock} from "./blocks.js";
import {Mesh, Group, Box3, Vector3, Box3Helper} from "three";
import {newBox} from "../lib/framework.js";
const bd = await blockData;

// Seed: 0
const getCoord = createNoise2D();

function getElevation(x, y) {
  x = Math.round(x / 2);
  y = Math.round(y / 2);
  return Math.round((getCoord(x, y) / 3) * 10) / 10;
}

const CHUNK_SIZE = 8;
const BVOLUME_SIZE = 8;
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
  var color = Math.random() * 0xffffff;
  const world = {};
  var xcounter = BVOLUME_SIZE;
  var ycounter = BVOLUME_SIZE;
  
  var currentGroup = new Group();
  const volumeGroups = [];
  const sizeGroups = [];
  
  for(let i = CHUNK_SIZE; i > 0; i--) {
    // goes sideways / x-axis
    const yc = i - CHUNK_SIZE / 2;
    
    for(let z = CHUNK_SIZE; z > 0; z--) {
      // goes down / y-axis
      const xc = z - CHUNK_SIZE / 2;
      
      add_blocks({xc, yc});
    }
  }
  
  // call this function for every block made
  function add_block(block) {
    scene.add(block);
    xcounter--;
    if(xcounter == 0) {
      xcounter = BVOLUME_SIZE;
      ycounter--;
      if(ycounter == 0) {
        ycounter = BVOLUME_SIZE;
        volumeGroups.push(currentGroup);
        color = Math.random() * 0xffffff;
        currentGroup = new Group();
      }
    }
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
  return {world, volumeGroups, sizeGroups};
}