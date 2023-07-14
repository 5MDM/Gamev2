export const canvasPaddingHeight = 50;
export const canvasPaddingWidth = 10;
export const canvasWidth = innerWidth - canvasPaddingWidth;
export const canvasHeight = innerHeight - canvasPaddingHeight;

addEventListener("touchend", e => e.preventDefault());

document.documentElement.style
.setProperty("--w", innerWidth + "px");
document.documentElement.style
.setProperty("--h", innerHeight + "px");

document.documentElement.style
.setProperty("--cw", canvasWidth + "px");
document.documentElement.style
.setProperty("--ch", canvasHeight + "px");