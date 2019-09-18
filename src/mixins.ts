
export interface IVector {
  x: number;
  y: number;
}

export interface IPosition extends IVector {
  alignment: number;
}

export interface IBoundingBox {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

type TBoundsType = "OBS_BOUNDS_STRETCH" | "OBS_BOUNDS_SCALE_INNER" | "OBS_BOUNDS_SCALE_OUTER" | "OBS_BOUNDS_SCALE_TO_WIDTH" | "OBS_BOUNDS_SCALE_TO_HEIGHT" | "OBS_BOUNDS_MAX_ONLY" | "OBS_BOUNDS_NONE";

export interface IBounds extends IPosition {
  type: TBoundsType;
}
