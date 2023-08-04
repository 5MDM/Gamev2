import {stopLoop, $, HSL} from "../lib/util.js";

var scene;
export function setTimeScene(s) {
  scene = s;
  main();
}

var isDay = true;
var sunset = false;
var sunrise = false;
const color = new HSL(210, 100, 70);
const c = $("#c");

const ogNightCycle = 50;
var nightCycle = ogNightCycle;

const ogDayCycle = 50;
var dayCycle = ogDayCycle;

const counterOg = 50;
var counter = counterOg;

const loop = stopLoop(({delta}) => {
  if(counter-- <= 0) {
    counter = counterOg;
    if(isDay) {
      tickDay();
    } else {
      sunset = false;
      tickNight();
    }
    
    c.style.backgroundColor = color.toCSS();
  }
}, false);

function tickDay() {
  if(sunset) {
    if(color.l <= 40) {
      if(color.h <= 262) {
        color.h += 2;
        color.l--;
      } else {
        if(color.l > 0) {
          color.l--;
        } else {
          isDay = false;
        }
      }
    } else {
      color.l -= 1;
    }
  } else if(sunrise) {
    if(color.h > 210) {
      color.h -= 2;
      color.l++;
    } else {
      if(color.l < 70) {
        color.l++;
      } else {
        sunrise = false;
      }
    }
  } else {
    // noon
    if(dayCycle > 0) {
      console.log(dayCycle);
      dayCycle--;
    } else {
      dayCycle = ogDayCycle;
      sunset = true;
    }
  }
}

function tickNight() {
  if(nightCycle <= 0) {
    nightCycle = ogNightCycle;
    isDay = true;
    sunrise = true;
  } else {
    nightCycle--;
  }
}

function main() {
  loop.start();
}