import {
  BufferAttribute,
  BufferGeometry,
  DynamicDrawUsage,
  Vector2,
  Vector3,
} from "three";

export interface HighPrecisionLineGeometryParameters {
  positions?: number[];
  positionsHigh?: Float32Array;
  positionsLow?: Float32Array;
}

export default class HighPrecisionLineGeometry extends BufferGeometry {
  readonly isHighPrecisionLineGeometry = true;

  constructor(parameters: HighPrecisionLineGeometryParameters = {}) {
    super();

    const { positions, positionsHigh, positionsLow } = parameters;

    if (positionsHigh && positionsLow) {
      if (positionsHigh.length !== positionsLow.length) {
        throw new Error(
          "HighPrecisionLineGeometry: positionsHigh and positionsLow must have the same length.",
        );
      }

      this.setPositionsHigh(positionsHigh);
      this.setPositionsLow(positionsLow);
    } else if (positions !== undefined) {
      this.setFromPositions(positions);
    }

    if (this.attributes.positionHigh) {
      this.setDrawRange(0, this.attributes.positionHigh.count);
    }
  }

  override setFromPoints(points: Vector2[] | Vector3[]): this {
    const positions: number[] = [];

    for (const point of points) {
      positions.push(point.x, point.y, "z" in point ? point.z : 0);
    }

    return this.setFromPositions(positions);
  }

  setFromPositions(positions: ArrayLike<number>): this {
    if (positions.length % 3 !== 0) {
      throw new Error(
        "HighPrecisionLineGeometry: positions array length must be divisible by 3.",
      );
    }

    const positionsHigh = new Float32Array(positions.length);
    const positionsLow = new Float32Array(positions.length);

    for (let i = 0; i < positions.length; i += 3) {
      positionsHigh[i] = Math.fround(positions[i]);
      positionsHigh[i + 1] = Math.fround(positions[i + 1]);
      positionsHigh[i + 2] = Math.fround(positions[i + 2]);

      positionsLow[i] = positions[i] - positionsHigh[i];
      positionsLow[i + 1] = positions[i + 1] - positionsHigh[i + 1];
      positionsLow[i + 2] = positions[i + 2] - positionsHigh[i + 2];
    }

    this.setPositionsHigh(positionsHigh);
    this.setPositionsLow(positionsLow);

    return this;
  }

  setPositionsHigh(positionsHigh: Float32Array): this {
    const attribute = new BufferAttribute(positionsHigh, 3).setUsage(
      DynamicDrawUsage,
    );

    this.setAttribute("positionHigh", attribute);
    this.setAttribute("position", attribute);

    return this;
  }

  setPositionsLow(positionsLow: Float32Array): this {
    this.setAttribute(
      "positionLow",
      new BufferAttribute(positionsLow, 3).setUsage(DynamicDrawUsage),
    );

    return this;
  }
}
