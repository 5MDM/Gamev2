import {PhysicsCamera} from "../lib/camera";
import {Scene} from "three";
import {newBox, newSphere} from "../lib/framework";
import {Mesh, Vector3} from "three";

// note: change box to sphere and
// update threeje-3d-camera to
// use spheres


export function initPlayerBox(scene: Scene, cam: PhysicsCamera): Mesh {
  const camBox = newSphere({
    radius: 0.2,
  });
  
  cam.bindPlayer(camBox);

  camBox.position.copy(cam.camera.position);
  camBox.position.y -= 2.5;

  cam.onMove = function() {
    camBox.position.copy(cam.camera.position);
    camBox.position.y -= 2.5;
  };
  
  return camBox;
}