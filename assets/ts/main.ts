import "./window";
import "./app";
import "./ui";
import "./loading";
import "./game/main-screen";
// import "./game/pause";

if(!window.Worker) throw new Error(
  "Your browser doesn't support web workers! "
+ "Use better hardware or a different browser"
);