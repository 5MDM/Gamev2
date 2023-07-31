import {PerspectiveCamera, BoxGeometry, MeshBasicMaterial, Mesh, TextureLoader, SRGBColorSpace} from "three";
import {canvasWidth, canvasHeight} from "../window.js";

/**
 * The constant value for 90 degrees in radians
 * @type {number}
 */
export const RADIAN_HALF = 1.570796;

/**
 * Creates a new perspective camera object with the given options
 * @param {Object} [o={}] - The options for the camera object
 * @param {number} [o.fov=80] - The field of view for the camera in degrees
 * @param {number} [o.min=0.1] - The near clipping plane for the camera
 * @param {number} [o.max=1000] - The far clipping plane for the camera
 * @returns {import("three").PerspectiveCamera} 
 *         The new perspective camera object
 */
export function newCamera(o = {}) {
  return new PerspectiveCamera(
    o.fov || 80,
    canvasWidth / canvasHeight,
    o.min || 0.1,
    o.max || 1000,
  );
}

const tLoader = new TextureLoader();

/**
 * Creates a new box geometry object with the given dimensions
 * @param {number} w - The width of the box
 * @param {number} [h] - The height of the box, optional
 * @param {number} l - The length of the box
 * @returns {import("three").BoxGeometry} 
 *         The new box geometry object
 */
export function newBoxGeometry(w, h, l) {
  if(h == undefined) {
    return new BoxGeometry(w, w, w);
  } else {
    return new BoxGeometry(w, h, l);
  }
}

/**
 * Creates a new box mesh object with the given options
 * @param {Object} [o={}] - The options for the box object
 * @param {number} [o.size] - The size of the box, optional
 * @param {number} [o.width] - The width of the box, optional
 * @param {number} [o.height] - The height of the box, optional
 * @param {number} [o.depth] - The depth of the box, optional
 * @param {import("three").Color | string | number} [o.color] - The color of the box, optional
 * @returns {Mesh} 
 *         The new box mesh object
 */
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

/**
 * Loads an image from a given URL or path and returns a promise that resolves with the texture object
 * @param {string} img - The URL or path of the image to load
 * @returns {Promise<import("three").Texture>} 
 *         A promise that resolves with the texture object that has the sRGB color space
 */
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
