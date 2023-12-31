
export class CoordinateMap3D<T> {
  map: {[key: string]: T} = {};
  
  set(x: number, y: number, z: number, e: T) {
    this.map[`${x},${y},${z}`] = e;
  }
  
  setProperty(x: number, y: number, z: number, property: string, e: any) {
    (this.map[`${x},${y},${z}`] as any)[property] = e;
  }
  
  get(x: number, y: number, z: number): T {
    return this.map[`${x},${y},${z}`];
  }
  
  forEach(f: (x: number, y: number, z: number) => void): void {
    for(const i in this.map) {
      const a: string[] = i.split(",");
      f(parseInt(a[0]), parseInt(a[1]), parseInt(a[2]));
    }
  }
  
  remove(x: number, y: number, z: number): void {
    delete this.map[`${x},${y},${z}`];
  }
}

export class CoordinateMap2D<T> {
  map: {[key: string]: T} = {};
  
  set(x: number, y: number, e: T) {
    this.map[`${x},${y}`] = e;
  }
  
  setProperty(x: number, y: number, property: string, e: any) {
    (this.map[`${x},${y}`] as any)[property] = e;
  }
  
  get(x: number, y: number): T {
    return this.map[`${x},${y}`];
  }
  
  forEach(f: (x: number, y: number) => void): void {
    for(const i in this.map) {
      const a: string[] = i.split(",");
      f(parseInt(a[0]), parseInt(a[1]));
    }
  }
  
  remove(x: number, y: number): void {
    delete this.map[`${x},${y}`];
  }
}

export interface VoxelFaceArray {
  uvRow: number;
  dir: [number, number, number],
  corners: [
    {pos: [number, number, number], uv: [number, number]},
    {pos: [number, number, number], uv: [number, number]},
    {pos: [number, number, number], uv: [number, number]},
    {pos: [number, number, number], uv: [number, number]},
  ],
};

export const faces: VoxelFaceArray[] = [
  { // left
    uvRow: 0,
    dir: [ -1,  0,  0, ],
    corners: [
      { pos: [ 0, 1, 0 ], uv: [ 0, 1 ], },
      { pos: [ 0, 0, 0 ], uv: [ 0, 0 ], },
      { pos: [ 0, 1, 1 ], uv: [ 1, 1 ], },
      { pos: [ 0, 0, 1 ], uv: [ 1, 0 ], },
    ],
  },
  { // right
    uvRow: 0,
    dir: [  1,  0,  0, ],
    corners: [
      { pos: [ 1, 1, 1 ], uv: [ 0, 1 ], },
      { pos: [ 1, 0, 1 ], uv: [ 0, 0 ], },
      { pos: [ 1, 1, 0 ], uv: [ 1, 1 ], },
      { pos: [ 1, 0, 0 ], uv: [ 1, 0 ], },
    ],
  },
  { // bottom
    uvRow: 1,
    dir: [  0, -1,  0, ],
    corners: [
      { pos: [ 1, 0, 1 ], uv: [ 1, 0 ], },
      { pos: [ 0, 0, 1 ], uv: [ 0, 0 ], },
      { pos: [ 1, 0, 0 ], uv: [ 1, 1 ], },
      { pos: [ 0, 0, 0 ], uv: [ 0, 1 ], },
    ],
  },
  { // top
    uvRow: 2,
    dir: [  0,  1,  0, ],
    corners: [
      { pos: [ 0, 1, 1 ], uv: [ 1, 1 ], },
      { pos: [ 1, 1, 1 ], uv: [ 0, 1 ], },
      { pos: [ 0, 1, 0 ], uv: [ 1, 0 ], },
      { pos: [ 1, 1, 0 ], uv: [ 0, 0 ], },
    ],
  },
  { // back
    uvRow: 0,
    dir: [  0,  0, -1, ],
    corners: [
      { pos: [ 1, 0, 0 ], uv: [ 0, 0 ], },
      { pos: [ 0, 0, 0 ], uv: [ 1, 0 ], },
      { pos: [ 1, 1, 0 ], uv: [ 0, 1 ], },
      { pos: [ 0, 1, 0 ], uv: [ 1, 1 ], },
    ],
  },
  { // front
    uvRow: 0,
    dir: [  0,  0,  1, ],
    corners: [
      { pos: [ 0, 0, 1 ], uv: [ 0, 0 ], },
      { pos: [ 1, 0, 1 ], uv: [ 1, 0 ], },
      { pos: [ 0, 1, 1 ], uv: [ 0, 1 ], },
      { pos: [ 1, 1, 1 ], uv: [ 1, 1 ], },
    ],
  },
];