import {pause} from "./settings/pause";
import {generateWorld} from "./generation/main";
import {scene} from "./main-screen";
import {cam} from "./camera";
import {renderLoop} from "../app";
import {$} from "../lib/util";
import {CameraOctreeMap} from "../lib/camera";
import {CoordinateMap2D} from "./generation/voxel-block";

$("#world-loader #generate-world")!.addEventListener("pointerup", () => {
  const worldPr = generateWorld(scene);
  worldPr.then(playWorld);
});

function playWorld(gworld: CoordinateMap2D<CameraOctreeMap>): void {
  $("#world-loader")!.style.display = "none";
  pause({resumeText: "Start Game"});
  cam.bindPhysics(gworld);
  renderLoop();
}
