
import { IBoundingBox, IPosition, IBounds, IVector } from "./mixins";
import { Base } from "./Base";

interface ISceneItemProperties {
  name: string;
  position: IPosition;
  rotation: number;
  scale: IVector;
  crop: IBoundingBox;
  visible: boolean;
  locked: boolean;
  bounds: IBounds;
  sourceWidth: number;
  sourceHeight: number;
  width: number;
  height: number;
}

export interface ISceneItemPropertiesUpdate {
  "scene-name"?: string; // the name of the scene that the source item belongs to. Defaults to the current scene.
  position?: number; // The new position & alignment of the source.
  rotation?: number; // The new clockwise rotation of the item in degrees.
  scale?: IVector; // The new scale of the item.
  crop?: IBoundingBox; // The new amount of pixels cropped off the source before scaling.
  visible?: boolean; // The new visibility of the source. 'true' shows source, 'false' hides source.
  locked?: boolean; // The new locked status of the source. 'true' keeps it in its current position, 'false' allows movement.
  bounds?: IBounds; // The new bounds type of the source.
}

export class SceneItem extends Base implements ISceneItemProperties {
  /** The name of the source. */
  name: string = "";
  /** The position of the item. */
  position: IPosition = {x: 0, y: 0, alignment: 0};
  /** The clockwise rotation of the item in degrees around the point of alignment. */
  rotation: number = 0;
  /** The x-scale factor of the source. */
  scale: IVector = {x: 0, y: 0};
  /** The number of pixels cropped off the source before scaling. */
  crop: IBoundingBox = {top: 0, bottom: 0, left: 0, right: 0};
  /** If the source is visible. */
  visible: boolean = true;
  /** If the source's transform is locked. */
  locked: boolean = false;
  /** Bounds. */
  bounds: IBounds = {x: 0, y: 0, alignment: 0, type: "OBS_BOUNDS_NONE"};
  /** Base width (without scaling) of the source */
  readonly sourceWidth: number = 1;
  /** Base source (without scaling) of the source */
  readonly sourceHeight: number = 1;
  /** Scene item width (base source width multiplied by the horizontal scaling factor) */
  width: number = 0;
  /** Scene item height (base source height multiplied by the vertical scaling factor) */
  height: number = 0;

  /**
   * Constructor shouldn't be used, use `SceneItem.create()` instead
   * @param width width of scene item
   * @param height height of scene item
   * @param sourceWidth
   * @param sourceHeight
   */
  constructor(obs: any, width: number, height: number, sourceWidth: number, sourceHeight: number) {
    super(obs);
    this.width = width;
    this.height = height;
    this.sourceWidth = sourceWidth;
    this.sourceHeight = sourceHeight;
  }

  /**
   * Creates a `SceneItem` from an object provided by OBS.
   * @param obs Instance of OBSWebSocket
   * @param properties Options to parse.
   */
  static create(obs: any, properties: ISceneItemProperties) {
    const instance = new SceneItem(
      obs,
      properties.width, properties.height,
      properties.sourceWidth, properties.sourceHeight
    );

    instance._updateProperties(properties);

    setInterval(() => {
      instance._tick.call(instance);
    }, 10);

    return instance;
  }

  /**
   * Every 10ms, update the scene's properties.
   * @private
   */
  _tick() {
    this._obs.send("GetSceneItemProperties", {item: this.name}) 
      .then((properties: any) => {
        this._updateProperties(properties);
      })
      .catch((error: any) => {
        console.error("Couldn't tickUpdate properties for SceneItem: " + error);
      });
  }

  /**
   * Update the SceneItem's properties
   * @private
   * @param properties Properties from OBS
   */
  _updateProperties(properties: ISceneItemProperties) {
    this.name = properties.name;
    this.position = properties.position;
    this.rotation = properties.rotation;
    this.scale = properties.scale;
    this.crop = properties.crop;
    this.visible = properties.visible;
    this.locked = properties.locked;
    this.bounds = properties.bounds;
    this.width = properties.width;
    this.height = properties.height;
  }

  /**
   * Update the properties of the SceneItem. Any not included will be ignored.
   * @param properties Properties to update.
   */
  update(properties: ISceneItemPropertiesUpdate) {
    const props = Object.assign({item: this.name}, properties);

    // Just to make sure rotation is readable
    if(props.rotation) {
      props.rotation = props.rotation > 359 ? props.rotation = 0 : props.rotation;
      props.rotation = props.rotation < 0 ? props.rotation = 359 : props.rotation;
    }

    this._obs.send("SetSceneItemProperties", props)
      .then(() => {
        // console.info(`Manually updated properties on SceneItem(${this.name})`, props);
      })
      .catch((error: any) => {
        console.error("Couldn't update properties on SceneItem:", error);
      });
  }
}
