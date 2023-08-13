
export class CoordinateMap3D<T> {
  map: {[key: string]: T} = {};
  
  set(x: number, y: number, z: number, e: T) {
    this.map[`${x},${y},${z}`] = e;
  }
  
  get(x: number, y: number, z: number): T {
    return this.map[`${x},${y},${z}`];
  }
}

export class CoordinateMap2D<T> {
  map: {[key: string]: T} = {};
  
  set(x: number, y: number, e: T) {
    this.map[`${x},${y}`] = e;
  }
  
  get(x: number, y: number): T {
    return this.map[`${x},${y}`];
  }
}

export interface VoxelFaceArray {
  dir: [number, number, number],
  corners: [
    [number, number, number],
    [number, number, number],
    [number, number, number],
    [number, number, number],
  ],
};

export const faces: VoxelFaceArray[] = [
  { // left
    dir: [-1, 0, 0],
    corners: [
      [0, 1, 0],
      [0, 0, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
  },
  { // right
    dir: [1, 0, 0],
    corners: [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 0],
      [1, 0, 0],
    ],
  },
  { // bottom
    dir: [0, -1, 0],
    corners: [
      [1, 0, 1],
      [0, 0, 1],
      [1, 0, 0],
      [0, 0, 0],
    ],
  },
  { // top
    dir: [0, 1, 0],
    corners: [
      [0, 1, 1],
      [1, 1, 1],
      [0, 1, 0],
      [1, 1, 0],
    ],
  },
  { // back
    dir: [0, 0, -1],
    corners: [
      [1, 0, 0],
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  },
  { // front
    dir: [0, 0, 1],
    corners: [
      [0, 0, 1],
      [1, 0, 1],
      [0, 1, 1],
      [1, 1, 1],
    ],
  },
];