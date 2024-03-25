import {BoxGeometry, Mesh, SphereGeometry, Sphere as threeSphere, Box3, Vector3} from "three";

var devMode = false;

export interface XYZ {
  x: number;
  y: number;
  z: number;
}

export interface BoxOpts extends XYZ {
  width: number;
  height: number;
  depth: number;
}

class Shape {
  public x: number = 0;
  public y: number = 0;
  public z: number = 0;

  constructor(x: number, y: number, z: number) {
    this.setPos(x, y, z);
  }
  
  public copy(e: Shape): void {
    this.x = e.x;
    this.y = e.y;
    this.z = e.z;
  }
  
  public setPos(x: number, y: number, z: number): void {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

export class Box extends Shape {
  width: number;
  height: number;
  depth: number;
  boundRef?: Box3;

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

  constructor(x: number, y: number, z: number, width: number, height: number, depth: number, boundRef?: Box3) {
    super(x, y, z);
    this.width = width;
    this.height = height;
    this.depth = depth;
    //increment();
    return this;
  }

  getDistanceToSphere(e: threeSphere): number {
    const v = new Vector3();
    const distance: Vector3 = this.boundRef!.clampPoint(e.center, v);
    return v.distanceToSquared(e.center);
  }
  
  delete(): void {
    //crashCounter--;
    this.boundRef = undefined;
  }

  intersectsSphere(sphere: {
    x: number;
    y: number;
    z: number;
    r: number;
  }) {
    const closest: {
      x: number;
      y: number;
      z: number;
    } = {
      x: Math.max(this.x - this.width / 2, Math.min(sphere.x, this.x + this.width / 2)),
      y: Math.max(this.y - this.height / 2, Math.min(sphere.y, this.y + this.height / 2)),
      z: Math.max(this.z - this.depth / 2, Math.min(sphere.z, this.z + this.depth / 2)),
    };

    const dSquared: number = 
    Math.pow(closest.x - sphere.x, 2) -
    Math.pow(closest.y - sphere.y, 2) -
    Math.pow(closest.z - sphere.z, 2);
    
    return dSquared <= Math.pow(sphere.r, 2);
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
  intersectsBox(e: Box | BoxOpts): boolean {
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

  containsBox(e: Box | BoxOpts): boolean {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const w = this.width;
    const h = this.height;
    const d = this.depth;

    return (x <= e.x 
    && x + w >= e.x + e.width 
    && y <= e.y 
    && y + h >= e.y + e.height 
    && z <= e.z 
    && z + d >= e.z + e.depth
    );
  }

  public static fromGeometry(e: BoxGeometry): Box {
    const s = e.boundingBox;
    if(s == undefined) throw new Error("global-objects.ts: bounding box wasn't calculated");

    return new Box(0, 0, 0, s.max.x - s.min.x, s.max.y - s.min.y, s.max.z - s.min.z, s);
  }

  public static fromMesh(e: Mesh): Box {
    const m = Box.fromGeometry(e.geometry as BoxGeometry);
    m.setPos(e.position.x, e.position.y, e.position.z);
    return m;
  }
}

export class Sphere extends Shape {
  public r: number;

  constructor(x: number, y: number, z: number, r: number) {
    super(x, y, z);
    this.r = r;
  }
  
  public override copy(e: Sphere): void {
    super.copy(e as Shape);
    this.r = e.r;
  }
  
  public toSphereGeometry(): SphereGeometry {
    return new SphereGeometry(this.r);
  }
  
  public static fromGeometry(e: SphereGeometry): Sphere {
    const s = e.boundingSphere;
    if(s === null) throw new Error("global-objects.ts: bounding sphere wasn't calculated");
    
    return new Sphere(0, 0, 0, s!.radius);
  }

  public static fromMesh(e: Mesh): Sphere {
    const m: Sphere = Sphere.fromGeometry(e.geometry as SphereGeometry);

    m.setPos(e.position.x, e.position.y, e.position.z);
    return m;
  }
}