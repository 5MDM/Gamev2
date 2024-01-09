import { supportsPointerLock } from "../window";
import {newCamera, RADIAN_HALF} from "./framework";
import {Octree} from "./quadrant";
import {clamp, stopLoop} from "./util";
import {Quaternion, Vector3, PerspectiveCamera, Mesh} from "three";
import {ControlCamera, MovementCamera} from "threejs-3d-camera";
import {CoordinateMap2D} from "../game/generation/voxel-block";



/**
 * Sets the quaternions for the x-axis and z-axis rotations from the given angles
 * @param mathX - The angle in radians for the x-axis rotation
 * @param mathY - The angle in radians for the z-axis rotation
 * @returns The pair of quaternions for the rotations
 */
export function setQuaternion(mathX: number, mathY: number): {qx: Quaternion, qz: Quaternion} {
  const qx = new Quaternion();
  qx.setFromAxisAngle(
    new Vector3(0, 1, 0),
    mathX,
  );
  const qz = new Quaternion();
  qz.setFromAxisAngle(
    new Vector3(1, 0, 0),
    mathY,
  );
  
  return {qx, qz};
}

// var current_qx = 0;

/**
 * Updates the camera quaternion from the given angles using the setQuaternion function
 * @param cam - The camera object to be updated
 * @param mathX - The angle in radians for the x-axis rotation
 * @param mathY - The angle in radians for the z-axis rotation
 */
export function updateCamera(cam: PerspectiveCamera, mathX: number, mathY: number) {
  const {qx, qz} = setQuaternion(mathX, mathY);
  // current_qx = qx._y;
  const q = new Quaternion();
  
  q.multiply(qx);
  q.multiply(qz);
  cam.quaternion.copy(q);
}

/**
 * A class that controls the camera quaternion and rotation from pointer events
 */

export interface CameraOctreeMap {
  tree: Octree | null;
  blocks: Mesh[];
  hasPhysics: boolean;
}

interface CameraConstructor {
  canvas: HTMLCanvasElement;
  fov?: number;
  width: number;
  height: number;
  max?: number;
  min?: number;
  mouseSensitivity?: number;
}

export class PhysicsCamera extends MovementCamera {
  /**
   * The list of blocks for the collision detection
   * @type {Array<import("three").Mesh>}
   */
  blockList?: Array<Mesh>;
  /**
   * The octrees for the collision detection
   * @type {import("./quadrant").Octree[]}
   */
  octrees?: CoordinateMap2D<CameraOctreeMap>;
  /**
   * The player object that is bound to the camera
   * @type {import("three").Mesh}
   */
  playerObj?: Mesh;
  /**
   * Creates a new PhysicsCamera instance with a new camera object
   * @param {Object} [o={}] - The options for the camera object
   * @param {number} [o.fov=80] - The field of view for the camera in degrees
   * @param {number} [o.min=0.1] - The near clipping plane for the camera
   * @param {number} [o.max=1000] - The far clipping plane for the camera
   * @param {number} [o.mouseSensitivity=100] - The mouse sensitivity of the camera movement
   */
  constructor(o: CameraConstructor) {
    super(o);
  }
  
  /**
   * A boolean flag that indicates whether the gravity is enabled or not
   * @type {boolean}
   */
  gravityEnabled: boolean = false;
  /**
   * The inertia value for the gravity effect
   * @type {number}
   */
  gravityInertia: number = 0;
  
  #gravityLoop = stopLoop(({delta}) => {
    this.gravityInertia += 0.005 * delta;
    super.moveDown(this.gravityInertia);
    if(this.gravityInertia > 0.01) this.canJump = false;
  }, false);
  
  /**
   * Binds the physics parameters to the camera
   * @param {Object} param0 - The physics parameters
   * @param {import("./quadrant").Octree[]} param0.trees - The octree for the collision detection
   * @returns {PhysicsCamera} 
   *         The current instance of PhysicsCamera
   */
  bindPhysics(o: CoordinateMap2D<CameraOctreeMap>): 
  PhysicsCamera {
    this.octrees = o;
    
    return this;
  }
  
  /**
   * Binds the player object to the camera
   * @param {import("three").Mesh} obj - The player object
   * @returns {PhysicsCamera} 
   *         The current instance of PhysicsCamera
   */
  bindPlayer(obj: import("three").Mesh): PhysicsCamera {
    this.playerObj = obj;
    return this;
  }
  
  /**
   * Checks if the camera has collided with any block in the octree
   * @returns {boolean} 
   *         True if there is a collision, false otherwise
   */
  collided(): boolean {
    if(!this.octrees) return false;
    if(!this.playerObj) return false;
    for(const treeF in this.octrees.map) {
      const tree = this.octrees.map[treeF];
      if(tree.tree == null) continue;
      const col = 
      tree.tree.get(this.playerObj, {
        width: 0.2,
        height: 5,
        depth: 0.2,
      });
      
      if(col.length != 0) return true;
    }
    
    return false;
  }
  
  /**
   * Moves the camera forward on the same y-axis
   * @param {number} [s=0.05] - The movement speed
   */
  moveForward(s: number = 0.05) {
    super.moveForward(s);
    if(this.collided()) super.moveDown(s);
  }
  
  /**
   * Moves the camera left
   * @param {number} [s=0.05] - The movement speed
   */
  moveLeft(s: number = 0.05) {
    super.moveLeft(s);
    if(this.collided()) super.moveRight(s);
  }
  
  /**
   * Moves the camera backwards on the same y-axis
   * @param {number} [s=0.05] - The movement speed
   */
  moveBackward(s: number = 0.05) {
    super.moveBackward(s);
    if(this.collided()) super.moveForward(s);
  }
  
  /**
   * Moves the camera right
   * @param {number} [s=0.05] - The movement speed
   */
  moveRight(s: number = 0.05) {
    super.moveRight(s);
    if(this.collided()) super.moveLeft(s);
  }
  
  /**
   * Moves the camera up vertically
   * @param {number} [s=0.04] - The movement speed
   */
  moveUp(s: number = 0.04) {
    super.moveUp(s);
    if(this.collided()) {
      super.moveDown(s);
      this.gravityInertia = 0;
      this.canJump = true;
    };
  }
  
  /**
   * Moves the camera down vertically
   * @param {number} [s=0.04] - The movement speed
   */
  moveDown(s: number = 0.04) {
    super.moveDown(s);
    if(this.collided()) super.moveUp(s);
  }
  
  /**
   * Enables gravity for the camera
   */
  enableGravity() {
    this.gravityEnabled = true;
    this.#gravityLoop.start();
    this.#jumpVelocity = 0.2;
  }
  
  /**
   * Disables gravity for the camera
   */
  disableGravity() {
    this.gravityInertia = 0;
    this.gravityEnabled = false;
    this.#gravityLoop.stop();
    this.#jumpVelocity = 0.1;
  }
  
  /**
   * A boolean flag that indicates whether the camera can jump or not
   * @type {boolean}
   */
  canJump: boolean = true;
  #jumpVelocity = 0.2;
  #gravity = 0.5;
  #jumpTime = 0;
  #jumpLoop = stopLoop(({stop, delta}) => {
    this.canJump = false;
    const deltaY = 
    this.#jumpVelocity * delta
    - this.#gravity * this.#jumpTime * delta;
    
    this.moveUp(deltaY);
    this.#jumpTime += 0.015 * delta;
    if(deltaY <= 0) {
      this.#jumpTime = 0.01 * delta;
      stop();
    }
  }, false);
  
  /**
   * Makes the camera jump if it's on the ground
   */
  jump() {
    if(this.canJump) {
      this.gravityInertia = 0;
      this.#jumpLoop.start();
    }
  }
}

export type AnyCamera = ControlCamera & MovementCamera & PhysicsCamera;