import {blockpr} from "./game/blocks.js";
import {blockArray} from "./game/world-generation.js";
import {$} from "./lib/util.js";

const arr = [blockpr, blockArray];

Promise.all(arr)
.then(() => {$("#loading-c").style.display = "none"})
.catch(console.error);