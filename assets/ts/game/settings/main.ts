import type {Mesh} from "three";
import type {AnyCamera} from "../../lib/camera";
import {$} from "../../lib/util";
import {setDebugObj} from "./debug";
import "./pause";
import { Octree } from "../../lib/quadrant";

const el: HTMLImageElement = $("#settings-btn")!;
const menu: HTMLDivElement = $("#settings #settings-menu")!;
var menuOpen = false;
var lastBtn: HTMLButtonElement;
var lastContent: HTMLDivElement;

el.addEventListener("pointerup", () => {
  if(menuOpen) {hideSettings()} 
  else {showSettings()}
});

export function hideSettings() {
  if(lastBtn != undefined) lastBtn.classList.remove("current");
  if(lastContent != undefined) lastContent.style.display = "none";
  $("#resume")!.style.display = "block";
  menu.style.display = "none";
  el.style.filter = "";
  menuOpen = false;
}

export function showSettings() {
  $("#resume")!.style.display = "none";
  el.style.filter = "brightness(50%)";
  menu.style.display = "flex";
  menuOpen = true;
}

// var cam;
// var playerObj;
// var trees;

function listen(id: string, f?: () => void) {
  const btn = 
  $("#settings #settings-menu #sidebar > " + id);
  if(btn == undefined) 
    throw new Error(`pause.js: button ID "${id}" not found`);
  
  const content = 
  $(`#settings #settings-menu #content > ${id}-content`);
  if(content == undefined) 
    throw new Error(`pause.js: content ID "${id}" not found`);
  
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

export function setDevObj(o: {camera: AnyCamera, player: Mesh, octrees: Octree[]}) {
  // cam = o.camera;
  // playerObj = o.player;
  // trees = o.octrees;
  setDebugObj({
    camera: o.camera,
    player: o.player,
    octrees: o.octrees,
    listen,
  });
}