// import {blockpr} from "./game/blocks";
import {blockArray} from "./game/generation/main";
import {$} from "./lib/util";

const promises = [blockArray];

Promise.all(promises)
.then(() => {
  $("#loading-c")!.style.display = "none";
  $("#ui")!.style.display = "flex";
})
.catch(console.error);
