import {blockpr} from "./game/blocks.js";
import {$} from "./lib/util.js";

const arr = [blockpr];

Promise.all(arr)
.then(() => {$("#loading-c").style.display = "none"})
.catch(console.error);