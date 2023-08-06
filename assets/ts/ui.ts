import {isTouchDevice} from "./window";
import {$} from "./lib/util";

if(isTouchDevice()) {
  $("#ui > #gui > #movement")!.style.display = "flex";
  $("#ui > #gui > #v-movement")!.style.display = "flex";
}