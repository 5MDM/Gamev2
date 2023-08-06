import {PerspectiveCamera, BoxGeometry, MeshBasicMaterial, Mesh, TextureLoader, SRGBColorSpace, Texture, Color} from "three";
import {canvasWidth, canvasHeight, imageImports} from "../window";

/**
 * The constant value for 90 degrees in radians
 * @type {number}
 */
export const RADIAN_HALF: number = 1.570796;

/**
 * Creates a new perspective camera object with the given options
 * @param {Object} [o={}] - The options for the camera object
 * @param {number} [o.fov=80] - The field of view for the camera in degrees
 * @param {number} [o.min=0.1] - The near clipping plane for the camera
 * @param {number} [o.max=1000] - The far clipping plane for the camera
 * @returns The new perspective camera object
 */
export function newCamera(o: {fov?: number, min?: number, max?: number} = {}) {
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
 * 
 * If only one parameter is provided, a cube is created
 * @param {number} w - The width of the box
 * @param {number} [h] - The height of the box, optional
 * @param {number} [l] - The length of the box, optional
 * @returns The new box geometry object
 */
export function newBoxGeometry(w: number, h?: number, l?: number) {
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
 * @returns The new box mesh object
 */
export function newBox(o: {
  size?: number,
  width?: number,
  height?: number,
  depth?: number,
  color?: Color | string | number
} = {}) {
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
export function loadImg(img: string): Promise<Texture> {
  return new Promise<Texture>(async (res, rej) => {
    tLoader.load(img, e => {
      // SRGB colorspace is needed
      // or else the image becomes
      // very faded
      e.colorSpace = SRGBColorSpace;
      res(e);
    }, undefined, (e) => {
      console.error(`loadImg error with image "${img}"`);
      rej(e);
    });
  });
}

/**
 * Loads an image from the `/assets/image/` directory and returns a promise that resolves with the texture object
 * @param {string} img - The exact path of the iamge starting from `/assets/images/`, without `./`, including file extension
 * @returns {Promise<import("three").Texture>} 
 *         A promise that resolves with the texture object that has the sRGB color space
 */
export async function loadImgFromAssets(img: string): Promise<Texture> {
  const path = (await imageImports[img]()).default
  return await loadImg(path)
}