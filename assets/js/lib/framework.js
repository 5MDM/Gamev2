import {PerspectiveCamera, BoxGeometry, MeshBasicMaterial, Mesh, TextureLoader, SRGBColorSpace} from "three";
import {canvasWidth, canvasHeight} from "../window.js";

export const RADIAN_HALF = 1.570796;

export function newCamera(o = {}) {
  return new PerspectiveCamera(
    o.fov || 80,
    canvasWidth / canvasHeight,
    o.min || 0.1,
    o.max || 1000,
  );
}

const tLoader = new TextureLoader();

export function newBoxGeometry(w, h, l) {
  if(h == undefined) {
    return new BoxGeometry(w, w, w);
  } else {
    return new BoxGeometry(w, h, l);
  }
}

export function newBox(o = {}) {
  const geo = new BoxGeometry(
    o.size || o.width,
    o.size || o.height,
    o.size || o.depth,
  );
  
  const mat = 
  new MeshBasicMaterial({color: o.color});
  
  return new Mesh(geo, mat);
}

export function loadImg(img) {
  return new Promise(res => {
    tLoader.load(img, e => {
      // SRGB colorspace is needed
      // or else the image becomes
      // very faded
      e.colorSpace = SRGBColorSpace;
      res(e);
    }, undefined, () => console.error(
      `loadImg error with image "${img}"`
    ));
  });
}
