import {isTouchDevice} from "./window.js";
import {$} from "./lib/util.js";

if(isTouchDevice()) {
  $("#ui > #gui > #movement").style.display = "flex";
  $("#ui > #gui > #v-movement").style.display = "flex";
}