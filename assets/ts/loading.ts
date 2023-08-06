// import {blockpr} from "./game/blocks";
import {blockData} from "./game/blocks";
import {blockArray} from "./game/world-generation";
import {$} from "./lib/util";

const promises = [blockArray, blockData];

Promise.all(promises)
.then(() => {
  $("#loading-c")!.style.display = "none";
  $("#ui")!.style.display = "flex";
})
.catch(console.error);