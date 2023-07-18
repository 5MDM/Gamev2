import {Vector3, Box3} from "three";

export class Quadtree {
  objects = [];
  subdivided = false;
  children = [];
  
  // boundary: new THREE.Box3()
  // capacity: positive number
  constructor(boundary, capacity = 4) {
    this.boundary = boundary;
    this.capacity = capacity;
    return this;
  }
  
  // object: new THREE.Box3()
  // ^ object.setFromObject(<insert mesh>) is recommended
  insert(object) {
    if(!this.boundary.containsPoint(object))
      return false;
    
    // Normal insert
    if(this.objects.length < this.capacity) {
      this.objects.push(object);
      return true;
    }

    if(!this.subdivided) this.subdivide();
    
    for(let i = 0; i < this.children.length; i++)
      if(this.children[i].insert(object)) return true;

    return false;
  }

  subdivide() {
    const box = this.boundary;
    const center = new Vector3();
    box.getCenter(center);
    
    const min = box.min;
    const max = box.max;

    const nw = new Box3(min, center);
    const ne = new Box3(
      new Vector3(center.x, min.y, min.z),
      new Vector3(max.x, center.y, center.z),
    );
    
    const sw = new Box3(
      new Vector3(min.x, center.y, center.z),
      new Vector3(center.x, max.y, max.z),
    );
    
    const se = new Box3(center, max);

    this.children.push(new Quadtree(nw, this.capacity));
    this.children.push(new Quadtree(ne, this.capacity));
    this.children.push(new Quadtree(sw, this.capacity));
    this.children.push(new Quadtree(se, this.capacity));

    this.subdivided = true;
  }

  retrieve(object) {
    const foundObjects = [];
    
    // if object is not in boundary
    if(!this.boundary.intersectsBox(object))
      return foundObjects;
    
    for(let i = 0; i < this.objects.length; i++)
      if(object !== this.objects[i] 
      && object.intersectsBox(this.objects[i]))
        foundObjects.push(this.objects[i]);
    
    if(this.subdivided)
      for(let i = 0; i < this.children.length; i++)
        foundObjects.push(...this.children[i].retrieve(object));
    
    return foundObjects;
  }
}
/*
// Create objects
var numObjects = 100;
var objectSize = 1;
var objectMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

var quadtreeBoundary = new Box3(
  new Vector3(-50, -50, -50),
  new Vector3(50, 50, 50),
);

var quadtree = new Quadtree(quadtreeBoundary);

// Check for collisions
function checkCollisions() {
  scene.children.forEach(function(object) {
    if(object !== player 
    && object.geometry instanceof THREE.BoxGeometry) {
      var objectBB = new THREE.Box3().setFromObject(object);

      var nearbyObjects = quadtree.retrieve(objectBB);

      for (var i = 0; i < nearbyObjects.length; i++) {
        var nearbyObject = nearbyObjects[i];
        if (objectBB.intersectsBox(nearbyObject)) {
          object.material.color.set(0x00ff00); // Collided with another object
          break;
        }
      }
    }
  });
}
// Render loop
*/