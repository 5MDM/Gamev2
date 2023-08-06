import {stopLoop, $, HSL} from "../lib/util";
import {getDevEl} from "./settings/debug";
import {gameState} from "../window";
import {PerspectiveCamera, Scene, Sprite, SpriteMaterial} from "three";
import {loadImgFromAssets, RADIAN_HALF} from "../lib/framework";

var scene: Scene;
var cam: PerspectiveCamera;
export function setTimeScene(s: Scene, c: PerspectiveCamera) {
  scene = s;
  cam = c;
  main();
}

var isDay = true;
var sunset = false;
var sunrise = false;
const color = new HSL(210, 100, 70);
const c = $("#c")!;

const orbitRadius = 100;
const orbitSpeed = 0.0002;
var sunAngle = 0;
var moonAngle = RADIAN_HALF * 2;

// const ogNightCycle = orbitSpeed;
// var nightCycle = ogNightCycle;

// const ogDayCycle = 50;
// var dayCycle = ogDayCycle;

const counterOg = 50;
var counter = counterOg;

const moon = new Sprite(new SpriteMaterial({
  map: await loadImgFromAssets("game/moon.png"),
}));

const sun = new Sprite(new SpriteMaterial({
  map: await loadImgFromAssets("game/sun.png"),
}));

moon.scale.set(20, 20, 1);
sun.scale.set(20, 20, 1);

const loop = stopLoop(({delta}) => {
  const trueDelta = Math.round(delta);
  counter -= trueDelta;
  
  tickSun(trueDelta);
  tickMoon(trueDelta);
  if(counter <= 0) {
    counter = counterOg;
    
    if(isDay) {
      tickDay(trueDelta);
    } else {
      tickNight(trueDelta);
    }
    
    c.style.backgroundColor = color.toCSS();
    if(gameState.devToolsEnabled) {
      getDevEl("time")!.innerText = 
      `${Math.floor(sunAngle * 20)}`;
      
      if(sunset) {
        getDevEl("time-type")!.innerText = "Sunset";
      } else if(sunrise) {
        getDevEl("time-type")!.innerText = "Sunrise";
      } else if(isDay) {
        getDevEl("time-type")!.innerText = "Day";
      } else if(!isDay) {
        getDevEl("time-type")!.innerText = "Night";
      } else {
        getDevEl("time-type")!.innerText = "Error";
      }
    }
  }
}, false);

const transitionSpeed = 3;
function tickDay(delta: number) {
  if(sunAngle >= RADIAN_HALF * 1.5) {
    sunset = true;
  }
  
  if(sunset) {
    if(color.l <= 40) {
      if(color.h <= 262) {
        color.h += 2 * delta * transitionSpeed;
        color.l -= delta * transitionSpeed;
      } else {
        if(color.l > 0) {
          color.l -= delta * transitionSpeed;
        } else {
          isDay = false;
          sunset = false;
        }
      }
    } else {
      color.l -= delta * transitionSpeed;
    }
  }
}

function tickNight(delta: number) {
  if(moonAngle >= RADIAN_HALF * 1.5) {
    sunrise = true;
  }
  
  if(sunrise) {
    if(color.h > 210) {
      color.h -= 2 * delta * transitionSpeed;
      color.l += delta * transitionSpeed;
    } else {
      if(color.l < 70) {
        color.l += delta * transitionSpeed;
      } else {
        sunrise = false;
        isDay = true;
      }
    }
  }
}

function tickSun(delta = 1) {
  sun.position.x = 
  cam.position.x + orbitRadius * Math.cos(sunAngle);
  
  sun.position.y = 
  cam.position.y + orbitRadius * Math.sin(sunAngle);
  
  sun.position.z = cam.position.z;
  sunAngle += orbitSpeed * delta;
  if(sunAngle >= RADIAN_HALF * 4) sunAngle = 0;
}

function tickMoon(delta = 1) {
  moon.position.x = 
  cam.position.x + orbitRadius * Math.cos(moonAngle);
  
  moon.position.y = 
  cam.position.y + orbitRadius * Math.sin(moonAngle);
  
  moon.position.z = cam.position.z;
  moonAngle += orbitSpeed * delta;
  if(moonAngle >= RADIAN_HALF * 4) moonAngle = 0;
}

function main() {
  tickSun();
  tickMoon();
  scene.add(sun);
  scene.add(moon);
  loop.start();
}