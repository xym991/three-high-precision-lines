import { Line } from "three";
import HighPrecisionLineGeometry from "../geometries/HighPrecisionLineGeometry";
import HighPrecisionLineMaterial from "../materials/HighPrecisionLineMaterial";

export default class HighPrecisionLine extends Line<
  HighPrecisionLineGeometry,
  HighPrecisionLineMaterial
> {
  readonly isHighPrecisionLine = true;

  constructor(
    geometry: HighPrecisionLineGeometry = new HighPrecisionLineGeometry(),
    material: HighPrecisionLineMaterial = new HighPrecisionLineMaterial(),
  ) {
    super(geometry, material);
  }
}
