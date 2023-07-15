import {newCamera, RADIAN_HALF} from "./framework.js";
import {Quaternion, Vector3} from "three";

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

export function updateCamera(cam, mathX, mathY) {
  const {qx, qz} = setQuaternion(mathX, mathY);
  current_qx = qx._y;
  const q = new Quaternion();
  
  q.multiply(qx);
  q.multiply(qz);
  cam.quaternion.copy(q);
}

export class ControlCamera {
  rx = RADIAN_HALF;
  ry = -RADIAN_HALF;
  canPan = false;
  
  constructor(o) {
    this.camera = newCamera(o);
    this.loop();
    return this;
  }
  
  loop() {
    updateCamera(this.camera, this.rx, this.ry);
    requestAnimationFrame(() => this.loop());
  }
  
  bind(el) {
    if(!el) return console.error(
      new Error("Binding element is undefined")
    );
    this.el = el;
    return this;
  }
  
  touch = {
    down: false,
    id: null,
    lx: 0,
    ly: 0,
    x: 0,
    y: 0,
  };
  
  onPointerMove = () => {};
  
  down(e) {
    if(!this.touch.down) {
      this.touch.down = true;
      this.touch.id = e.pointerId;
      this.touch.lx = e.pageX;
      this.touch.ly = e.pageY;
    }
  }
  
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
  
  up(e) {
    if(this.touch.down) {
      this.touch.down = false;
      this.touch.id = null;
    }
  }
  
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
  
  setDefault(x, y) {
    updateCamera(this.camera, x, y);
    this.rx = x;
    this.ry = y;
    return this;
  }
  
  disable() {
    this.canPan = false;
    return this;
  }
}

export class MovementCamera extends ControlCamera {
  direction = new Vector3();
  canMove = true;
  constructor(o) {
    super(o);
  }
  
  onMovement = function(s) {return s};
  
  moveUp(s = 0.03) {
    const forward = 
    this.camera.getWorldDirection(
      new Vector3(0, 0, -1)
    );
    this.camera.translateZ(
      (4 - (Math.cos(forward.y) * 3)) * (-s)
    );
    this.camera.position.y = 0;
  }
  
  moveLeft(s = 0.03) {
    s = this.onMovement(s);
    this.camera.translateX(-s);
  }
  
  moveDown(s = 0.03) {
    this.moveUp(-s);
  }
  
  moveRight(s = 0.03) {
    s = this.onMovement(s);
    this.camera.translateX(s);
  }
}

export const message = {
  show: function (message, type = "info", time = 3000, { width = "50%", height = "10%" } = {}) {
    if (!message) throw mderr(`Expected string as message, got ${message}`);
    const types = [
      "info",
      "warning",
      "error"
    ];
    if (!types.includes(type)) throw mderr(`Invalid type ${type}`);
    time = parseInt(time)
    if (!time || time < 1) throw mderr(`Invalid time ${time}`)
    const box = $("#message");
    box.style.display = "block";
    box.style.width = width;
    box.style.height = height;
    box.innerHTML = message;
    switch(type) {
      case "info":
        box.style.backgroundColor = "#7a7a7a";
        box.style.color = "white";
      break;
      case "warning":
        box.style.backgroundColor = "#aeb800";
        box.style.color = "black";
      break;
      case "error":
        box.style.backgroundColor = "#ff1c03";
        box.style.color = "black";
      break;
    }
    setTimeout(() => {
      box.style.display = "none";
    }, time)
  },
  hide: () => {
    $("#message").style.display = "none";
  },
  get: () => {
    return $("#message").innerText
  }
}