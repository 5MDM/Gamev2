import {createNoise2D} from "./perlin.js";

const getCoord = createNoise2D(() => 0);
console.log(getCoord(0, 1));
console.log(getCoord(0, 1));