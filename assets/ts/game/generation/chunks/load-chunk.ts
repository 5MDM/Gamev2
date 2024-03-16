import {getElevation} from "../seed";
import {XYZ} from "../../../lib/global-objects";
import {CHUNK_SIZE, loopThroughChunkYAxis} from "../main";

export function loadVoxelChunk(
  addBlock: (uv: number, yy: number) => void,
  startY: number,
  x: number,
  z: number,
): void {
  // will loop until it reached the end of
  // the chunk y-level
  const elev = getElevation(x, z);
  loopThroughChunkYAxis(startY, y => {
    if(y + elev >= startY + CHUNK_SIZE) return;
    var uv = 0;
    
    if(y + elev < -5) uv = 1;
    addBlock(uv, y + elev);
  });
}