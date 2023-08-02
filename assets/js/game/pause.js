import {$, stopLoop} from "../lib/util.js";

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

var cam;
var playerObj;
var trees;
export function setDevObj(o = {}) {
  cam = o.camera;
  playerObj = o.player;
  trees = o.octrees;
}

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
    
    if(f != undefined) f();
  });
}

function getDevEl(id) {
  return $("#ui > #gui > #debug > #stats #" + id);
}

const devPos = getDevEl("pos");
const xe = getDevEl("x");
const ye = getDevEl("y");
const ze = getDevEl("z");
const devFps = getDevEl("fps");
const deltaTime = getDevEl("delta-time");

var lastTime = performance.now();
var fpsCounter = 3;
const devLoop = stopLoop(({delta}) => {
  const {x, y, z} = cam.camera.position;
  devPos.innerText = 
  `(${Math.floor(x)}, ${Math.floor(y)}, ${Math.floor(z)})`;
  
  const ma = 1000000;
  xe.innerText = Math.round(x * ma) / ma;
  ye.innerText = Math.round(y * ma) / ma;
  ze.innerText = Math.round(z * ma) / ma;
  
  const currentTime = performance.now();
  const fps = 1000 / (currentTime - lastTime);
  lastTime = currentTime;
  if(fpsCounter-- <= 0) {
    devFps.innerText = Math.round(fps * 100) / 100;
    fpsCounter = 3;
  }
  deltaTime.innerText = Math.round(delta * 10) / 10;
}, false);

const debugEl = $("#ui > #gui > #debug");
var devToolsOn = false;

function toggleDevTools() {
  if(devToolsOn) {
    devToolsOn = false;
    $("#ui > #gui > #pause #pause-menu #content > #dev-content #dev-enabled").innerText = "False";
    devLoop.stop();
    debugEl.style.display = "none";
  } else {
    devToolsOn = true;
    $("#ui > #gui > #pause #pause-menu #content > #dev-content #dev-enabled").innerText = "True";
    devLoop.start();
    debugEl.style.display = "block";
  }
}

addEventListener("keydown", e => {
  e.preventDefault();
  if(e.code == "F3") toggleDevTools();
});

$("#ui > #gui > #pause #pause-menu #content > #dev-content #dev-toggle")
.addEventListener("pointerup", toggleDevTools);

listen("#dev");