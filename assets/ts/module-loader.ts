(async function() {
  "use strict";
  try {
    await import("./main");
  } catch(err: any) {
    function $(e: string) {
      return <HTMLElement>document.querySelector(e);
    }
    
    $("#loading-c")!.style.display = "none";
    $("#error-overlay")!.style.display = "flex";
    $("#error-overlay #error-txt")!.innerText = err;
    $("#error-overlay #error-stack")!.innerText = 
    err.stack || "Stack is undefined";
    
    $("#error-overlay #copy-error")
    .addEventListener("pointerup", () => {
      if("clipboard" in navigator) {
        navigator.clipboard.writeText(`${err}\n${err.stack}`)
        .then(() => alert("Copied!"))
        .catch(() => alert("Couldn't copy"))
      } else {
        alert("Clipboard is unsupported in your browser");
      }
    });
  }
})();