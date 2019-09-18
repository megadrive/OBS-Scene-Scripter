
import { OBSWSM } from "./OBSWSM";
import { ISceneItemPropertiesUpdate } from "./SceneItem";

const ws = new OBSWSM();

(async () => {
  await ws.connect();

  const source = await ws.getSceneItem("ThisIsTestTextForOBSWSM");

  console.dir(source);
  
  setInterval(() => {
    let update = source.rotation;
    update += 1;
    source.update({rotation: update});
    console.log(source.rotation);
  }, 10);
})();
