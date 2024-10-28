import {stopLoop, $, HSL} from "../lib/util";
import {getDevEl} from "./settings/debug";
import {gameState} from "../window";
import {PerspectiveCamera, Scene, Sprite, SpriteMaterial, MeshBasicMaterial, Color, BackSide, Mesh, SphereGeometry, ShaderMaterial} from "three";
import {loadImgFromAssets, RADIAN_HALF} from "../lib/framework";
import { radians } from "three/examples/jsm/nodes/Nodes.js";

var scene: Scene;
var cam: PerspectiveCamera;
export function setTimeScene(s: Scene, c: PerspectiveCamera) {
  scene = s;
  cam = c;
  main();
}

const tSpeed: number = 0.1;
const colorDifference: Color = new Color(0.014 * tSpeed, 0.044 * tSpeed, 0.05 * tSpeed);

var isDay = true;
var sunset = false;
var sunrise = false;

const orbitRadius = 100;
const orbitSpeed = 0.0008;
var sunAngle = 0;
var moonAngle = RADIAN_HALF * 2;

const counterOg = 10;
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

const transitionSpeed = 2;
function tickDay(delta: number) {
  if(sunAngle >= RADIAN_HALF * 1.5
  && sunAngle <= RADIAN_HALF * 2) {
    sunset = true;
  }
  
  if(sunset) {
    skyColor.top.sub(colorDifference);
    if(skyColor.top.b <= 0.2) {
      sunset = false;
      isDay = false;
    }
  }
}

function tickNight(delta: number) {
  if(moonAngle >= RADIAN_HALF * 1.5
  && moonAngle <= RADIAN_HALF * 2) {
    sunrise = true;
  }
  
  if(sunrise) {
    skyColor.top.add(colorDifference);
    if(skyColor.top.b >= skyColor.ogTop.b) {
      isDay = true;
      sunrise = false;
    }
  }
}

function tickSun(delta = 1) {
  if(sunAngle >= RADIAN_HALF * 4) {
    sunAngle -= RADIAN_HALF * 4;
  }

  sun.position.x = 
  cam.position.x + orbitRadius * Math.cos(sunAngle);
  
  sun.position.y = 
  cam.position.y + orbitRadius * Math.sin(sunAngle);
  
  sun.position.z = cam.position.z;
  sunAngle += orbitSpeed * delta;
}

function tickMoon(delta = 1) {
  if(moonAngle >= RADIAN_HALF * 4) {
    moonAngle -= RADIAN_HALF * 4;
  }

  moon.position.x = 
  cam.position.x + orbitRadius * Math.cos(moonAngle);
  
  moon.position.y = 
  cam.position.y + orbitRadius * Math.sin(moonAngle);
  
  moon.position.z = cam.position.z;
  moonAngle += orbitSpeed * delta;
}

var sphere: Mesh;
const skyColor: {top: Color; bottom: Color; ogTop: Color; ogBottom: Color} = {
  ogBottom: new Color("purple"),
  bottom: new Color("purple"),
  ogTop: new Color(0x7ABAC6),
  top: new Color(0x7ABAC6),
};

function addSkySphere() {
  const geometry = new SphereGeometry(400, 32, 32);
  geometry.computeBoundingBox();

  const material = new ShaderMaterial({
    side: BackSide,
    uniforms: {
      color1: {
        value: skyColor.bottom,
      },
      color2: {
        value: skyColor.top,
      },
      bboxMin: {
        value: geometry.boundingBox!.min
      },
      bboxMax: {
        value: geometry.boundingBox!.max
      },
      gScale: {
        value: 1
      },
    },
    
    vertexShader: `
      uniform vec3 bboxMin;
      uniform vec3 bboxMax;
      
      varying vec2 vUv;
      
      void main() {
        vUv.y = (position.y - bboxMin.y) / (bboxMax.y - bboxMin.y);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
    
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform float gScale;
      
      varying vec2 vUv;
      
      void main() {
        float scale = vUv.y * gScale;
        vec3 color = mix(color1, color2, scale);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
  
  sphere = new Mesh(
    geometry,
    material,
  );
  
  sphere.position.x = cam.position.x;
  sphere.position.y = cam.position.y;
  sphere.position.z = cam.position.z;
  //scene.add(sphere);
}

function main() {
  addSkySphere();
  //scene.add(sphere);
  tickSun();
  tickMoon();
  scene.add(sun);
  scene.add(moon);
  loop.start();
}
