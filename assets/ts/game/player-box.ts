import {PhysicsCamera} from "../lib/camera";
import {Scene} from "three";
import {newBox} from "../lib/framework";
import {Mesh} from "three";

export function initPlayerBox(scene: Scene, cam: PhysicsCamera): Mesh {
  const camBox = newBox({
    width: 0.2,
    height: 3,
    depth: 0.2,
    color: 0xf0f0f0,
  });
  
  cam.bindPlayer(camBox);

  camBox.position.x = cam.camera.position.x;
  camBox.position.y = cam.camera.position.y-2.5;
  camBox.position.z = cam.camera.position.z;

  cam.onMove = function() {
    camBox.position.x = cam.camera.position.x;
    camBox.position.y = cam.camera.position.y-2.5;
    camBox.position.z = cam.camera.position.z;
  };
  
  return camBox;
}