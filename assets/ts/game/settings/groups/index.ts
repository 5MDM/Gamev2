import {$} from "../../../lib/util";

import {developer} from "./developer";
import {video} from "./video";

[developer, video]
.forEach(group => {
  group.addToDOM($("#sidebar")!, $("#content")!)
})