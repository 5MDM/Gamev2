import {createNoise2D} from "./perlin.js";
import {blockData, blockGeometry} from "../game/blocks.js";
import {Mesh} from "three";
const bd = await blockData;

// Seed: 0

const getCoord = createNoise2D();

function getElevation(x, y) {
  return Math.round(getCoord(x, y) * 10) / 10;
}

const CHUNK_SIZE = 10;
const chunks = [];
const grassM = bd.data[bd.name["Grass"]];

export function generateWorld(scene) {
  for(let i = CHUNK_SIZE; i >= 0; i--) {
    const yc = i - CHUNK_SIZE / 2;
    
    for(let z = CHUNK_SIZE; z >= 0; z--) {
      const xc = z - CHUNK_SIZE / 2;
      const grassBlock = new Mesh(blockGeometry, grassM);
      grassBlock.position.x = xc;
      grassBlock.position.z = yc;
      grassBlock.position.y = getElevation(xc, yc) - 5;
      
      scene.add(grassBlock);
    }
  }
}