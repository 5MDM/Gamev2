import {$} from "../lib/util.js";

const el = $("#ui > #gui > #pause #pause-btn");
const menu = $("#ui > #gui > #pause #pause-menu");
const movement = $("#ui > #gui > #movement");
const vmovement = $("#ui > #gui > #v-movement");
var menuOpen = false;

function hide() {
  menu.style.display = "none";
  el.style.filter = "";
  menuOpen = false;
  movement.style.display = "flex";
  vmovement.style.display = "flex";
}

function show() {
  el.style.filter = "brightness(50%)";
  vmovement.style.display = "none";
  movement.style.display = "none";
  menu.style.display = "flex";
  menuOpen = true;
}

el.addEventListener("pointerup", () => {
  if(menuOpen) {hide()} 
  else {show()}
});