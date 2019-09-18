import { SceneItem } from "./SceneItem";

const OBSWebSocket = require("obs-websocket-js");

export class OBSWSM {
  /**
   * The `obs-websocket-js` connection.
   * @private
   */
  _obs: any;

  constructor() {
    this._obs = new OBSWebSocket();
    this._obs.on('error', (err: any) => {
      console.error('socket error:', err);
    });
  }

  /**
   * Connect to OBS.
   * @param connectionOptions OBSWebSocketJS connection options.
   */
  async connect(connectionOptions?: any) {
    try {
      await this._obs.connect(connectionOptions);
      console.info("Connected to OBS.");
    } catch (err) {
      console.error("Could not connect to OBS. Exiting.");
      process.exit(1);
    }
  }
  
  /**
   * Gets a SceneItem.
   * 
   * @param {string} sourceName Source name to get
   * @param {string} sceneName Scene name to get, optional.
   * @returns {Promise<SceneItem>} The `SceneItem`, or `null` if not in this `Scene`.
   */
  async getSceneItem(sourceName: string, sceneName?: string) {
    try {
      const res = await this._obs.send("GetSceneItemProperties", {item: sourceName, "scene-name": sceneName});
      return SceneItem.create(this._obs, res);
    } catch (err) {
      throw new Error("Couldn't get source, " + err);
    }
  }
}
