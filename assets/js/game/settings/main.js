import {$, addEventListeners, stopLoop, round} from "/assets/js/lib/util.js";
import {gameState, supportsPointerLock} from "/assets/js/window.js";
import {Vector3, MathUtils} from "three";
import {setDebugObj} from "./debug.js";
import "./pause.js";

const el = $("#settings-btn");
const menu = $("#settings #settings-menu");
var menuOpen = false;
var lastBtn;
var lastContent;

el.addEventListener("pointerup", () => {
  if(menuOpen) {hideSettings()} 
  else {showSettings()}
});

function hideSettings() {
  if(lastBtn != undefined) lastBtn.classList.remove("current");
  if(lastContent != undefined) lastContent.style.display = "none";
  $("#resume").style.display = "block";
  menu.style.display = "none";
  el.style.filter = "";
  menuOpen = false;
}

function showSettings() {
  $("#resume").style.display = "none";
  el.style.filter = "brightness(50%)";
  menu.style.display = "flex";
  menuOpen = true;
}

var cam;
var playerObj;
var trees;

function listen(id, f) {
  const btn = 
  $("#settings #settings-menu #sidebar > " + id);
  if(btn == undefined) 
    throw new Error(`pause.js: button ID "${id}" not found`);
  
  const content = 
  $(`#settings #settings-menu #content > ${id}-content`);
  
  btn.addEventListener("pointerup", () => {
    if(lastBtn != undefined)
      lastBtn.classList.remove("current");
    
    lastBtn = btn;
    btn.classList.add("current");
    
    lastContent = content;
    content.style.display = "flex";
    
    if(f != undefined) f();
  });
}

export function setDevObj(o = {}) {
  cam = o.camera;
  playerObj = o.player;
  trees = o.octrees;
  setDebugObj({
    camera: o.camera,
    player: o.player,
    trees: o.octrees,
    listen,
  });
}