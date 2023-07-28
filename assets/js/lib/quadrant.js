import {Vector3, Box3, Mesh, Box3Helper} from "three";
import {HSL} from "./util.js";
import {newBox} from "./framework.js";

var debugMode = false;
var crashCounter = 0;
var objLimit = 50000;
function increment() {
  if(++crashCounter > objLimit)
  throw new Error(
    "Octree: too many objects"
  );
}

var scene;
export function setDebugScene(s) {
  debugMode = true;
  scene = s;
}

function renderBox(e, color) {
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

class Box {
  constructor({x, y, z, width, height, depth}) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width;
    this.height = height;
    this.depth = depth;
    increment();
    renderBox(this, 0xfff000);
    return this;
  }
  
  intersectsBoxDebug(e) {
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
    
    function check(arr) {
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
  
  intersectsBox(e) {
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

export class Octree {
  constructor(bounds) {
    this.bounds = new Box(bounds);
    this.children = [];
    this.box = null;
  }

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

  insert(b) {
    const box = new Box(b);
    if(!this.bounds.intersectsBox(box)) {
      if(this.bounds.width == 2) this.bounds.intersectsBoxDebug(box);
      return false;
    }
    
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
  
  get(a) {
    var e;
    if(a instanceof Mesh) {
      // hardcoded
      e = {
        x: a.position.x,
        y: a.position.y,
        z: a.position.z,
        width: 0.2,
        height: 1,
        depth: 0.2,
      };
    } else {
      e = a;
    }
    
    const found = [];
    if(!this.bounds.intersectsBox(e)) return found;
    if(this.bounds.width <= 1) {
      if(this.bounds.intersectsBox(e)) found.push(this.box);
    } else {
      for(const child of this.children) {
        found.push(...child.get(e));
      }
    }
    
    return found;
  }
}

const MDBox = Box;

export {MDBox};