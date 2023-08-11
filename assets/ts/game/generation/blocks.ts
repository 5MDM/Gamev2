import {newBoxGeometry, loadImgFromAssets} from "../../lib/framework";
import {MeshBasicMaterial, Mesh, Material} from "three";
import blocks from "../../../game/blocks.json";

export const blockGeometry = newBoxGeometry(1);

async function mm(e: string) {
  return new MeshBasicMaterial({
    map: await loadImgFromAssets(`game/${e}`),
  });
}

export function newBlock(e: Material) {
  return new Mesh(blockGeometry, e);
}

export const blockData = new Promise
<{data: MeshBasicMaterial[], name: {[key: string]: number}}>(async res => {
  const nameArr: {[key: string]: number} = {};
  const arr = [];
  
  for(let i = 0; i <= blocks.length-1; i++) {
    const block = blocks[i];
    arr.push(await mm(block.texture));
    
    nameArr[block.name] = i;
  }
  
  res({
    data: arr,
    name: nameArr,
  });
});
