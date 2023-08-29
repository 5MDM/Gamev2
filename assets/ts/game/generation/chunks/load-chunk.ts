import {getElevation, XYZ} from "../seed";
import {CHUNK_SIZE, loopThroughChunkYAxis} from "../main";

export function loadVoxelChunk(
  addBlock: (uv: number, yy: number) => void,
  startY: number
): void {
  // will loop until it reached the end of
  // the chunk y-level
  loopThroughChunkYAxis(startY, y => {
    addBlock(0, y);
  });
}