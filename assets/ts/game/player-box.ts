import {PhysicsCamera} from "../lib/camera";
import {Scene} from "three";
import {newBox, newSphere} from "../lib/framework";
import {Mesh, Vector3} from "three";

// note: change box to sphere and
// update threeje-3d-camera to
// use spheres


export function initPlayerBox(scene: Scene, cam: PhysicsCamera): Mesh {
  /*const camBox = newBox({
    width: 0.2,
    height: 3,
    depth: 0.2,
    color: 0xf0f0f0,
  });*/

  const camBox = newSphere({
    radius: 0.2,
  });
  
  cam.bindPlayer(camBox);

  camBox.position.copy(cam.camera.position);
  //camBox.position.y = cam.camera.position.y - 2.5;
  camBox.position.y -= 2.5;
  /*camBox.position.x = cam.camera.position.x;
  camBox.position.y = cam.camera.position.y-2.5;
  camBox.position.z = cam.camera.position.z;*/

  cam.onMove = function() {
    camBox.position.copy(cam.camera.position);
    camBox.position.y -= 2.5;
    //camBox.position.y = cam.camera.position.y-2.5;
    //camBox.position.z = cam.camera.position.z;
  };
  
  return camBox;
}