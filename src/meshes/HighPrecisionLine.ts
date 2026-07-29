import { Camera, Line, Matrix4, Vector3 } from "three";

import splitVector3 from "../utils/splitVector3";

import HighPrecisionLineGeometry from "../geometries/HighPrecisionLineGeometry";
import HighPrecisionLineMaterial from "../materials/HighPrecisionLineMaterial";

const _cameraWorldPosition = new Vector3();
const _objectSpaceCamera = new Vector3();

export default class HighPrecisionLine extends Line<
  HighPrecisionLineGeometry,
  HighPrecisionLineMaterial
> {
  readonly isHighPrecisionLine = true;

  private readonly _inverseMatrix = new Matrix4();
  private readonly _objectLinearTransform = new Matrix4();

  constructor(
    geometry = new HighPrecisionLineGeometry(),
    material = new HighPrecisionLineMaterial(),
  ) {
    super(geometry, material);
  }

  override updateMatrixWorld(force?: boolean): void {
    super.updateMatrixWorld(force);

    // Cache expensive transforms whenever matrixWorld changes.

    this._inverseMatrix.copy(this.matrixWorld).invert();

    this._objectLinearTransform.copy(this.matrixWorld).setPosition(0, 0, 0);
  }

  override onBeforeRender(renderer: any, scene: any, camera: Camera): void {
    const uniforms = this.material.uniforms;

    uniforms.opacity.value = this.material.opacity;

    // Upload cached object transform.
    uniforms.objectLinearTransform.value.copy(this._objectLinearTransform);

    // Transform camera into this object's local space.
    camera.getWorldPosition(_cameraWorldPosition);

    _objectSpaceCamera
      .copy(_cameraWorldPosition)
      .applyMatrix4(this._inverseMatrix);

    splitVector3(
      _objectSpaceCamera,
      uniforms.cameraHigh.value,
      uniforms.cameraLow.value,
    );

    // Upload camera rotation.
    uniforms.viewRotation.value.extractRotation(camera.matrixWorldInverse);
  }
}
