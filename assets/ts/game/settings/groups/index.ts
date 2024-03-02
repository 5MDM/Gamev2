import {$} from "../../../lib/util";

import {video} from "./video";
import {developer} from "./developer";

[
  video,
  developer,
]
.forEach(group => {
  group.addToDOM($("#sidebar")!, $("#content")!)
});