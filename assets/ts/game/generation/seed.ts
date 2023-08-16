import {round} from "../../lib/util";
import {createNoise2D} from "../../lib/perlin"

export const seed = round(Math.random(), 10000);
const getCoord = createNoise2D(() => seed);

export function getElevation(x: number, y: number) {
  function e(a: number) {
    return getCoord(x*a, y*a);
  }
  
  return Math.floor(e(0.05) * 2) / 2;
}