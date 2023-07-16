import {newBoxGeometry, loadImg} from "../lib/framework.js";
import {MeshBasicMaterial} from "three";

export const blockGeometry = newBoxGeometry(1);

async function mm(e) {
  return new MeshBasicMaterial({
    map: await loadImg(`/assets/images/game/${e}`),
  });
}

export const blockpr = fetch("/assets/js/game/blocks.json");

export const blockData = new Promise(res => {
  const nameArr = {};
  const arr = [];
  
  blockpr.then(e => e.json())
  .then(async e => {
    for(let i = 0; i <= e.length-1; i++) {
      const block = e[i];
      arr.push(await mm(block.texture));
      
      nameArr[block.name] = i;
      res({
        data: arr,
        name: nameArr,
      });
    }
  });
});
