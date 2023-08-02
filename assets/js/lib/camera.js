import {newCamera, RADIAN_HALF} from "./framework.js";
import {stopLoop} from "./util.js";
import {Quaternion, Vector3, PerspectiveCamera} from "three";

/**
 * @typedef {Object} QuaternionPair
 * @property {import("three").Quaternion} qx - The quaternion for the x-axis rotation
 * @property {import("three").Quaternion} qz - The quaternion for the z-axis rotation
 */

/**
 * Sets the quaternions for the x-axis and z-axis rotations from the given angles
 * @param {number} mathX - The angle in radians for the x-axis rotation
 * @param {number} mathY - The angle in radians for the z-axis rotation
 * @returns {QuaternionPair} 
 *         The pair of quaternions for the rotations
 */
export function setQuaternion(mathX, mathY) {
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

var current_qx = 0;

/**
 * Updates the camera quaternion from the given angles using the setQuaternion function
 * @param {ControlCamera | MovementCamera | PhysicsCamera} cam - The camera object to be updated
 * @param {number} mathX - The angle in radians for the x-axis rotation
 * @param {number} mathY - The angle in radians for the z-axis rotation
 */
export function updateCamera(cam, mathX, mathY) {
  const {qx, qz} = setQuaternion(mathX, mathY);
  current_qx = qx._y;
  const q = new Quaternion();
  
  q.multiply(qx);
  q.multiply(qz);
  cam.quaternion.copy(q);
}

/**
 * A class that controls the camera quaternion and rotation from pointer events
 */
export class ControlCamera {
  /**
   * The angle in radians for the x-axis rotation
   * @type {number}
   */
  rx = RADIAN_HALF;
  /**
   * The angle in radians for the y-axis rotation
   * @type {number}
   */
  ry = -RADIAN_HALF;
  /**
   * A boolean flag that indicates whether the camera can pan or not
   * @type {boolean}
   */
  canPan = false;
  /**
   * The camera object that is controlled by the ControlCamera instance
   * @type {PerspectiveCamera}
   */
  camera;
  /**
   * The element that the control camera is bound to and listens for pointer events
   * @type {Element}
   */
  el;
  
  /**
   * Creates a new ControlCamera instance with a new camera object
   * @param {Object} [o={}] - The options for the camera object
   * @param {number} [o.fov=80] - The field of view for the camera in degrees
   * @param {number} [o.min=0.1] - The near clipping plane for the camera
   * @param {number} [o.max=1000] - The far clipping plane for the camera
   */
  constructor(o) {
    this.camera = newCamera(o);
    this.loop();
    return this;
  }
  
  /**
   * Updates the camera quaternion from the current angles and requests an animation frame
   */
  loop() {
    updateCamera(this.camera, this.rx, this.ry);
    requestAnimationFrame(() => this.loop());
  }
  
  /**
   * Binds the control camera to a given element
   * @param {Element} el - The element to bind to
   * @returns {ControlCamera} 
   *         The current instance of ControlCamera
   */
  bind(el) {
    if(!el) return console.error(
      new Error("Binding element is undefined")
    );
    this.el = el;
    return this;
  }
  
  /**
   * @typedef {Object} TouchInfo
   * @property {boolean} down - A flag that indicates whether the pointer is down or not
   * @property {number} id - The identifier of the pointer
   * @property {number} lx - The last x-coordinate of the pointer
   * @property {number} ly - The last y-coordinate of the pointer
   * @property {number} x - The current x-coordinate of the pointer
   * @property {number} y - The current y-coordinate of the pointer
   */
  /**
   * An object that stores the touch information
   * @type {TouchInfo}
   */
  touch = {
    down: false,
    id: null,
    lx: 0,
    ly: 0,
    x: 0,
    y: 0,
  };
  
  /**
   * A function that handles the pointer move event
   */
  onPointerMove = () => {};
  
  /**
   * Handles the pointer down event and sets the touch information
   * @param {PointerEvent} e - The pointer down event
   */
  down(e) {
    if(!this.touch.down) {
      this.touch.down = true;
      this.touch.id = e.pointerId;
      this.touch.lx = e.pageX;
      this.touch.ly = e.pageY;
    }
  }
  
  /**
   * Handles the touch move or mouse move event and updates the touch information and angles
   * @param {TouchEvent|MouseEvent} e - The touch move or mouse move event
   */
  move(e) {
    if(e.identifier == this.touch.id) {
      this.touch.x = this.touch.lx - e.pageX;
      this.touch.y = this.touch.ly - e.pageY;
      this.touch.lx = e.pageX;
      this.touch.ly = e.pageY;
      
      const sx = -this.touch.x * 0.005;
      const sy = this.touch.y * 0.005;
      
      this.onPointerMove({
        x: this.touch.x,
        y: this.touch.y,
      });
    }
  }
  
  /**
   * Handles the pointer up event and resets the touch information
   * @param {PointerEvent} e - The pointer up event
   */
  up(e) {
    if(this.touch.down) {
      this.touch.down = false;
      this.touch.id = null;
    }
  }
  
  /**
   * Enables the camera panning and adds the event listeners to the element
   * @returns {ControlCamera} 
   *         The current instance of ControlCamera
   */
  enable() {
    this.canPan = true;
    this.el
    .addEventListener("pointerdown", e => this.down(e));
    
    // Use targetTouches instead of
    // regular touches or else it glitches
    this.el.addEventListener("touchmove", 
      e => this.move(
        e.targetTouches[e.targetTouches.length-1]
      ),
    );
    
    this.el
    .addEventListener("mousemove", e => this.down(e));
    
    this.el
    .addEventListener("pointerup", e => this.up(e));
    
    return this;
  }
  
  /**
   * Sets the default angles for the camera quaternion and updates it accordingly
   * @param {number} x - The angle in radians for the x-axis rotation
   * @param {number} y - The angle in radians for the y-axis rotation
   * @returns {ControlCamera} 
   *         The current instance of ControlCamera
   */
  setDefault(x, y) {
    updateCamera(this.camera, x, y);
    this.rx = x;
    this.ry = y;
    return this;
  }
  
  /**
   * Disables the camera panning
   * @returns {ControlCamera} 
   *         The current instance of ControlCamera
   */
  disable() {
    this.canPan = false;
    return this;
  }
}

/**
 * A class that extends the ControlCamera class and adds the movement functionality
 * @extends {ControlCamera}
 */
export class MovementCamera extends ControlCamera {
  /**
   * The direction vector for the camera movement
   * @type {import("three").Vector3}
   */
  direction = new Vector3();
  /**
   * A boolean flag that indicates whether the camera can move or not
   * @type {boolean}
   */
  canMove = true;
  /**
   * Creates a new MovementCamera instance with a new camera object
   * @param {Object} [o={}] - The options for the camera object
   * @param {number} [o.fov=80] - The field of view for the camera in degrees
   * @param {number} [o.min=0.1] - The near clipping plane for the camera
   * @param {number} [o.max=1000] - The far clipping plane for the camera
   */
  constructor(o) {
    super(o);
  }
  
  /**
   * A function that handles the camera movement event
   */
  onMove = function() {};
  /**
   * A function that modifies the movement speed before applying it
   * @param {number} s - The movement speed
   * @returns {number} 
   *         The modified movement speed
   */
  preMove = function(s) {return s}
  
  /**
   * Moves the camera forward based on camera direction including vertical
   * @param {number} [s=0.05] - The movement speed
   */
  rawMoveUp(s = 0.05) {
    s = this.preMove(s);
    const cameraDirection = new Vector3();
    this.camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
  
    const delta = cameraDirection.multiplyScalar(s);
    this.camera.position.add(delta);
    this.onMove();
  }
  
  /**
   * Moves the camera forward on the same y-axis
   * @param {number} [s=0.05] - The movement speed
   */
  moveUp(s = 0.05) {
    s = this.preMove(s);
    const cameraDirection = new Vector3();
    this.camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0; // Disregard y-axis
    cameraDirection.normalize(); // THIS IS IMPORTANT
  
    const delta = cameraDirection.multiplyScalar(s);
    this.camera.position.add(delta);
    this.onMove();
  }
  
  /**
   * Moves the camera left
   * @param {number} [s=0.05] - The movement speed
   */
  moveLeft(s = 0.05) {
    s = this.preMove(s);
    this.camera.translateX(-s);
    this.onMove();
  }
  
  /**
   * Moves the camera backwards on the same y-axis
   * @param {number} [s=0.05] - The movement speed
   */
  moveDown(s = 0.05) {
    this.moveUp(-s);
  }
  
  /**
   * Moves the camera right
   * @param {number} [s=0.05] - The movement speed
   */
  moveRight(s = 0.05) {
    s = this.preMove(s);
    this.camera.translateX(s);
    this.onMove();
  }
  
  /**
   * Moves the camera up vertically
   * @param {number} [s=0.04] - The movement speed
   */
  moveAbove(s = 0.04) {
    s = this.preMove(s);
    this.camera.position.y += s;
    this.onMove();
  }
  
  /**
   * Moves the camera down vertically
   * @param {number} [s=0.04] - The movement speed
   */
  moveBelow(s = 0.04) {
    this.moveAbove(-s);
  }
}

/**
 * A class that extends the MovementCamera class and adds the physics and collision functionality
 * @extends {MovementCamera}
 */
export class PhysicsCamera extends MovementCamera {
  /**
   * The list of blocks for the collision detection
   * @type {Array<import("three").Mesh>}
   */
  blockList;
  /**
   * The octree for the collision detection
   * @type {import("./quadrant.js").Octree}
   */
  octree;
  /**
   * The player object that is bound to the camera
   * @type {import("three").Mesh}
   */
  playerObj;
  /**
   * Creates a new PhysicsCamera instance with a new camera object
   * @param {Object} [o={}] - The options for the camera object
   * @param {number} [o.fov=80] - The field of view for the camera in degrees
   * @param {number} [o.min=0.1] - The near clipping plane for the camera
   * @param {number} [o.max=1000] - The far clipping plane for the camera
   */
  constructor(o) {
    super(o);
  }
  
  /**
   * A boolean flag that indicates whether the gravity is enabled or not
   * @type {boolean}
   */
  gravityEnabled = false;
  /**
   * The inertia value for the gravity effect
   * @type {number}
   */
  gravityInertia = 0;
  
  #gravityLoop = stopLoop(({delta}) => {
    this.gravityInertia += 0.005 * delta;
    super.moveBelow(this.gravityInertia)
    if(this.gravityInertia > 0.01) this.canJump = false;
  }, false);
  
  /**
   * Binds the physics parameters to the camera
   * @param {Object} param0 - The physics parameters
   * @param {import("./quadrant.js").Octree} param0.tree - The octree for the collision detection
   * @returns {PhysicsCamera} 
   *         The current instance of PhysicsCamera
   */
  bindPhysics({trees}) {
    this.octrees = trees;
    return this;
  }
  
  /**
   * Binds the player object to the camera
   * @param {import("three").Mesh} obj - The player object
   * @returns {PhysicsCamera} 
   *         The current instance of PhysicsCamera
   */
  bindPlayer(obj) {
    this.playerObj = obj;
    return this;
  }
  
  /**
   * Checks if the camera has collided with any block in the octree
   * @returns {boolean} 
   *         True if there is a collision, false otherwise
   */
  collided() {
    for(const tree of this.octrees) {
      const col = 
      tree.get(this.playerObj, {
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
  moveUp(s = 0.05) {
    super.moveUp(s);
    if(this.collided()) super.moveDown(s);
  }
  
  /**
   * Moves the camera left
   * @param {number} [s=0.05] - The movement speed
   */
  moveLeft(s = 0.05) {
    super.moveLeft(s);
    if(this.collided()) super.moveRight(s);
  }
  
  /**
   * Moves the camera backwards on the same y-axis
   * @param {number} [s=0.05] - The movement speed
   */
  moveDown(s = 0.05) {
    super.moveDown(s);
    if(this.collided()) super.moveAbove(s);
  }
  
  /**
   * Moves the camera right
   * @param {number} [s=0.05] - The movement speed
   */
  moveRight(s = 0.05) {
    super.moveRight(s);
    if(this.collided()) super.moveLeft(s);
  }
  
  /**
   * Moves the camera up vertically
   * @param {number} [s=0.04] - The movement speed
   */
  moveAbove(s = 0.04) {
    super.moveAbove(s);
    if(this.collided()) {
      super.moveBelow(s);
      this.gravityInertia = 0;
      this.canJump = true;
    };
  }
  
  /**
   * Moves the camera down vertically
   * @param {number} [s=0.04] - The movement speed
   */
  moveBelow(s = 0.04) {
    super.moveBelow(s);
    if(this.collided()) super.moveAbove(s);
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
  canJump = true;
  #jumpVelocity = 0.2;
  #gravity = 0.5;
  #jumpTime = 0;
  #jumpLoop = stopLoop(({stop, delta}) => {
    this.canJump = false;
    const deltaY = 
    this.#jumpVelocity * delta
    - this.#gravity * this.#jumpTime * delta;
    
    this.moveAbove(deltaY);
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