import {Vector3, Box3, Mesh, Box3Helper, Scene, Color} from "three";

var debugMode = false;

var scene: Scene;

/**
 * Enables debug mode and assigns the scene object to a given parameter
 * @param {import("three").Scene} s - The scene object to be assigned
 */
export function setDebugScene(s: Scene) {
  debugMode = true;
  scene = s;
}

function renderBox(e: Box, color: Color) {
  if(!debugMode) return;
  const hx = e.width / 2;
  const hy = e.height / 2;
  const hz = e.depth / 2;
  
  const box = new Box3(
    new Vector3(e.x-hx, e.y-hy, e.z-hz),
    new Vector3(e.x+hx, e.y+hy, e.z+hz),
  );
  
  scene.add(new Box3Helper(box, color));
}

/**
 * A class that represents a three-dimensional rectangular region with a center point and dimensions
 */
class Box {
  /**
   * The x-coordinate of the center of the box
   */
  x: number;
  /**
   * The y-coordinate of the center of the box
   */
  y: number;
  /**
   * The z-coordinate of the center of the box
   */
  z: number;
  /**
   * The width of the box
   */
  width: number;
  /**
   * The height of the box
   */
  height: number;
  /**
   * The depth of the box
   */
  depth: number;
  /**
   * Creates a new Box instance with the given parameters
   * @param param0 - The parameters for the box
   * @param param0.x - The x-coordinate of the center of the box
   * @param param0.y - The y-coordinate of the center of the box
   * @param param0.z - The z-coordinate of the center of the box
   * @param param0.width - The width of the box
   * @param param0.height - The height of the box
   * @param param0.depth - The depth of the box
   */
  constructor({x, y, z, width, height, depth}: { x: number; y: number; z: number; width: number; height: number; depth: number; }) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width;
    this.height = height;
    this.depth = depth;
    //increment();
    return this;
  }
  
  delete(): void {
    //crashCounter--;
  }
  
  /**
   * Checks if the box intersects with another box and logs the reason if not
   * @param e - The other box to check for intersection
   * @returns True if the boxes intersect, false otherwise
   */
  intersectsBoxDebug(e: Box): boolean {
    const x1 = this.x;
    const y1 = this.y;
    const z1 = this.z;
    const w1 = this.width;
    const h1 = this.height;
    const d1 = this.depth;
    
    const x2 = e.x;
    const y2 = e.y;
    const z2 = e.z;
    const w2 = e.width;
    const h2 = e.height;
    const d2 = e.depth;
    
    function check(arr: boolean[]) {
      for(const i in arr) {
        if(!arr[i]) {
          switch(parseInt(i)) {
            case 0: 
            console.log(`0: ${x1} < ${x2} + ${w2}`); break;
            case 1:
            console.log(`1: ${x1} + ${w1} > ${x2}`); break;
            case 2:
            console.log(`2: ${y1} < ${y2} + ${h2}`); break;
            case 3:
            console.log(`3: ${y1} + ${h1} > ${y2}`); break;
            case 4:
            console.log(`4: ${z1} < ${z2} + ${d2}`); break;
            case 5:
            console.log(`5: ${z1} + ${d1} > ${z2}`); break;
          }
        }
      }
    }
    
    if(x1 < x2 + w2 
    && x1 + w1 > x2 
    && y1 < y2 + h2 
    && y1 + h1 > y2 
    && z1 < z2 + d2 
    && z1 + d1 > z2) {
      return true;
    }
    
    check([
      x1 < x2 + w2,
      x1 + w1 > x2,
      y1 < y2 + h2,
      y1 + h1 > y2,
      z1 < z2 + d2,
      z1 + d1 > z2,
    ]);
    
    return false;
  }
  
  /**
   * Checks if the box intersects with another box
   * @param e - The other box to check for intersection
   * @returns True if the boxes intersect, false otherwise
   */
  intersectsBox(e: Box | {
    x: number,
    y: number,
    z: number,
    width: number,
    height: number,
    depth: number
  }): boolean {
    const x1 = this.x;
    const y1 = this.y;
    const z1 = this.z;
    const w1 = this.width;
    const h1 = this.height;
    const d1 = this.depth;
    
    const x2 = e.x;
    const y2 = e.y;
    const z2 = e.z;
    const w2 = e.width;
    const h2 = e.height;
    const d2 = e.depth;
    
    if(x1 < x2 + w2 
    && x1 + w1 > x2 
    && y1 < y2 + h2 
    && y1 + h1 > y2 
    && z1 < z2 + d2 
    && z1 + d1 > z2) {
      return true;
    }
    
    return false;
  }
}

/**
 * A class that represents an octree data structure for efficient spatial partitioning and collision detection
 */
export class Octree {
  /**
   * The bounding box for the octree
   */
  bounds: Box;
  /**
   * The array of children octrees that subdivide the parent octree
   */
  children: Array<Octree>;
  /**
   * The box object that is inserted into the octree
   */
  box: Box | null;
  /**
   * Creates a new Octree instance with a given bounding box
   * @param bounds - The bounding box for the octree
   * @param bounds.x - The x-coordinate of the center of the bounding box
   * @param bounds.y - The y-coordinate of the center of the bounding box
   * @param bounds.z - The z-coordinate of the center of the bounding box
   * @param bounds.width - The width of the bounding box
   * @param bounds.height - The height of the bounding box
   * @param bounds.depth - The depth of the bounding box
   */
  constructor(bounds: { x: number; y: number; z: number; width: number; height: number; depth: number }) {
    this.bounds = new Box(bounds);
    this.children = [];
    this.box = null;
  }

  /**
   * Subdivides the octree into eight smaller octrees with equal dimensions
   */
  subdivide() {
    const {x, y, z, width, height, depth} = this.bounds;

    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const halfDepth = depth / 2;
    
    const o1 = 
    new Octree({x, y, z, width: halfWidth, height: halfHeight, depth: halfDepth});
    const o2 = 
    new Octree({x: x + halfWidth, y, z, width: halfWidth, height: halfHeight, depth: halfDepth});
    const o3 =
    new Octree({x, y: y + halfHeight, z, width: halfWidth, height: halfHeight, depth: halfDepth});
    const o4 =
    new Octree({x: x + halfWidth, y: y + halfHeight, z, width: halfWidth, height: halfHeight, depth: halfDepth});
    const o5 =
    new Octree({x, y, z: z + halfDepth, width: halfWidth, height: halfHeight, depth: halfDepth});
    const o6 =
    new Octree({x: x + halfWidth, y, z: z + halfDepth, width: halfWidth, height: halfHeight, depth: halfDepth});
    const o7 =
    new Octree({x, y: y + halfHeight, z: z + halfDepth, width: halfWidth, height: halfHeight, depth: halfDepth});
    const o8 =
    new Octree({x: x + halfWidth, y: y + halfHeight, z: z + halfDepth, width: halfWidth, height: halfHeight, depth: halfDepth});
    
    this.children.push(o1);
    this.children.push(o2);
    this.children.push(o3);
    this.children.push(o4);
    this.children.push(o5);
    this.children.push(o6);
    this.children.push(o7);
    this.children.push(o8);
  }

  /**
   * Inserts a box object into the octree
   * @param b - The box object to insert
   * @param b.x - The x-coordinate of the center of the box
   * @param b.y - The y-coordinate of the center of the box
   * @param b.z - The z-coordinate of the center of the box
   * @param b.width - The width of the box
   * @param b.height - The height of the box
   * @param b.depth - The depth of the box
   * @returns True if the insertion was successful, false otherwise
   */
  insert(b: { x: number; y: number; z: number; width: number; height: number; depth: number; }): boolean {
    const box = new Box(b);
    if(!this.bounds.intersectsBox(box)) return false;
    
    if(this.bounds.width > 1) {
      this.subdivide();
      for(let child of this.children) {
        if(child.insert(box)) return true;
      }
    } else {
      if(!this.box) {
        this.box = box;
        
        return true;
      } else {
        console.warn("Why is the box even full");
      }
    }

    return false;
  }
  
  /**
   * Returns an array of boxes that intersect with a given box or mesh object in the octree
   * @param a - The box or mesh object to check for intersection
   * @returns An array of boxes that intersect with the given object in the octree
   */
  get(a: Box | Mesh | {
    x: number,
    y: number,
    z: number,
    width: number,
    height: number,
    depth: number
  }, size?: {width: number, height: number, depth: number}): Array<Box> {
    var e: {
      x: number,
      y: number,
      z: number,
      width: number,
      height: number,
      depth: number
    };
    if(a instanceof Mesh) {
      // hardcoded
      e = {
        x: a.position.x,
        y: a.position.y,
        z: a.position.z,
        width: size!.width,
        height: size!.height,
        depth: size!.depth,
      };
    } else {
      e = a;
    }
    
    const found: Box[] = [];
    if(!this.bounds.intersectsBox(e)) return found;
    if(this.bounds.width == 1) {
      if(this.bounds.intersectsBox(e)
      && this.box != null) found.push(this.box);
    } else {
      for(const child of this.children) {
        found.push(...child.get(e));
      }
    }
    
    return found;
  }
  
  getPoint(a: Box | Mesh | {
    x: number,
    y: number,
    z: number,
  }): Box | null {
    var e: {
      x: number,
      y: number,
      z: number,
      width: number,
      height: number,
      depth: number
    };
    if(a instanceof Mesh) {
      // hardcoded
      e = {
        x: a.position.x,
        y: a.position.y,
        z: a.position.z,
        width: 1,
        height: 1,
        depth: 1,
      };
    } else {
      e = {
        x: a.x,
        y: a.y,
        z: a.z,
        width: 1,
        height: 1,
        depth: 1,
      };
    }
    
    return this.get(e)?.[0];
  }
  
  delete(): void {
    for(const child of this.children) child.delete();
    this.box?.delete();
    this.box = null;
  }
}
