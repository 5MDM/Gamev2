import {isTouchDevice} from "./window.js"
import {$} from "./lib/util.js"

if (isTouchDevice()) {
  $("#gui").innerHTML += `
    <div id="movement">
      <div>
        <img id="up" alt="up" src="/assets/images/game/arrow.png">
      </div>
      <div>
        <img id="left" alt="left" src="/assets/images/game/arrow.png">
        <img id="down" alt="down" src="/assets/images/game/arrow.png">
        <img id="right" alt="right" src="/assets/images/game/arrow.png">
      </div>
    </div>
    `
}