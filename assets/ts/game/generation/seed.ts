import {round} from "../../lib/util";
import {createNoise2D} from "../../lib/perlin"

export var seed = round(Math.random(), 10000);

export function setSeed(n: number): void {
  seed = n;
}

const getCoord = createNoise2D(() => seed);

export function getElevation(x: number, y: number) {
  function e(a: number) {
    return getCoord(x*a, y*a);
  }
  
  return Math.floor(e(0.01) * 20) / 2;
}
/*
export interface XYZ {
  x: number;
  y: number;
  z: number;
}*/