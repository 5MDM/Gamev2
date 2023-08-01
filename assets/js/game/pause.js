import {$} from "../lib/util.js";

const el = $("#ui > #gui > #pause #pause-btn");
const menu = $("#ui > #gui > #pause #pause-menu");
const movement = $("#ui > #gui > #movement");
const vmovement = $("#ui > #gui > #v-movement");
var menuOpen = false;
var lastBtn;
var lastContent;

function hide() {
  if(lastBtn != undefined) lastBtn.style.filter = "";
  if(lastContent != undefined) lastContent.style.display = "none";
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

function listen(id, f) {
  const btn = 
  $("#ui > #gui > #pause #pause-menu #sidebar > " + id);
  if(btn == undefined) 
    throw new Error(`pause.js: button ID "${id}" not found`);
  
  const content = 
  $(`#ui > #gui > #pause #pause-menu #content > ${id}-content`);
  
  btn.addEventListener("pointerup", () => {
    if(lastBtn != undefined)
      lastBtn.style.filter = "";
    
    lastBtn = btn;
    btn.style.filter = "brightness(66%)";
    
    lastContent = content;
    content.style.display = "flex";
    
    f({btn: el});
  });
}

var cam;
var playerObj;
var trees;
export function setDevObj(o = {}) {
  cam = o.camera;
  playerObj = o.player;
  trees = o.octrees;
}

listen("#dev", ({btn}) => {
  
});