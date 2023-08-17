// This file will be to used to make
// an UV map using all the blocks

const c: HTMLCanvasElement = 
document.createElement("canvas");

const ctx: CanvasRenderingContext2D | null = 
c.getContext("2d");

if(ctx == undefined)
 throw new Error("blocks.ts: Could not make context");

const facesY: number = 3;
var blockSize: number;

export function generateUVMap(): Promise<HTMLCanvasElement> {
  return new Promise(res => {
    fetch("/assets/game/blocks.json")
    .then(e => e.json())
    .then(async dat => {
      blockSize = dat.size;
      
      c.setAttribute(
        "width", 
        (dat.blocks.length * blockSize).toString(),
      );
      
      c.setAttribute(
        "height",
        ((facesY + 1) * blockSize).toString(),
      );
      
      for(const block of dat.blocks) await parseBlocks(block);
      
      res(c);
      
      /*(c.toBlob((blob: Blob | null): void => {
        if(blob) {
          const url = URL.createObjectURL(blob);
          alert(url);
        }
      });*/
    });
  });
}

interface BlockData {
  name: string;
  texture: string | {
    top?: string;
    bottom?: string;
    sides?: string;
  };
}

var currentX: number = 0;
var currentY: number = 0;

const imageImport = 
import.meta.glob<{default: string}>
("../../../images/game/blocks/**");

if(Object.keys(imageImport).length == 0) {
  const err = new Error(
    `block.ts: image imports has wrong file URL or is empty`
  );
}

async function parseBlocks(block: BlockData):
Promise<void> {
  const pr: Promise<void> = new Promise(async (res, rej) => {
    if(typeof block.texture == "string") {
      const img = new Image();
      
      const imgURL = await
      imageImport[
        `../../../images/game/blocks/${block.texture}`
      ]();
      
      const notFindError = new Error(
        "block.ts: could not find "
      + `"${block.texture}"`
      );
      
      if(imgURL == undefined) {
        console.error(notFindError);
        rej();
      } else {
        img.src = imgURL.default; 
      }
      
      img.onload = function() {
        for(let i = 0; i != facesY; i++) {
          ctx!.drawImage(img, currentX, currentY);
          currentY += blockSize;
        }
        
        currentY = 0;
        res();
      };
      
      img.onerror = function(e) {
        const err = new Error(
          `block.ts: Could not load texture `
        + `"${block.texture}"`
        );
        
        console.error(lr(err));
      }
    } else {
      // different sides
      
    }
    //currentX += blockSize;
  });
  
  pr.finally(() => currentX += blockSize);
  
  return pr;
}

function lr(e: Error) {
  return e + "\n" + e.stack;
}