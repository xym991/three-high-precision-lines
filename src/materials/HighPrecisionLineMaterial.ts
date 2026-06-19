import {
  Camera,
  Color,
  Matrix4,
  ShaderMaterial,
  Vector3,
  type ColorRepresentation,
} from "three";

import splitVector3 from "../utils/splitVector3";

export interface HighPrecisionLineMaterialParameters {
  color?: ColorRepresentation;
  opacity?: number;
  transparent?: boolean;
}

export default class HighPrecisionLineMaterial extends ShaderMaterial {
  readonly isHighPrecisionLineMaterial = true;

  declare uniforms: {
    cameraHigh: { value: Vector3 };
    cameraLow: { value: Vector3 };
    rotation: { value: Matrix4 };
    diffuse: { value: Color };
    opacity: { value: number };
  };

  constructor(parameters: HighPrecisionLineMaterialParameters = {}) {
    super({
      uniforms: {
        cameraHigh: { value: new Vector3() },
        cameraLow: { value: new Vector3() },
        rotation: { value: new Matrix4() },

        diffuse: {
          value: new Color(parameters.color ?? 0xffffff),
        },

        opacity: {
          value: parameters.opacity ?? 1,
        },
      },

      vertexShader: `
        attribute vec3 positionHigh;
        attribute vec3 positionLow;

        uniform vec3 cameraHigh;
        uniform vec3 cameraLow;

        uniform mat4 rotation;

        void main() {

          vec3 relative =
            ( positionHigh - cameraHigh ) +
            ( positionLow - cameraLow );

          gl_Position =
            projectionMatrix *
            rotation *
            vec4( relative, 1.0 );

        }
      `,

      fragmentShader: `
        uniform vec3 diffuse;
        uniform float opacity;

        void main() {

          gl_FragColor = vec4( diffuse, opacity );

        }
      `,

      transparent: parameters.transparent ?? false,
    });

    this.opacity = parameters.opacity ?? 1;
  }

  get color(): Color {
    return this.uniforms.diffuse.value;
  }

  override onBeforeRender(): void {
    this.uniforms.opacity.value = this.opacity;
  }

  setCamera(camera: Camera): void {
    camera.updateMatrixWorld(true);

    this.setCameraPosition(camera.position);
    this.setCameraRotation(camera.matrixWorldInverse);
  }

  setCameraPosition(position: Vector3): void {
    splitVector3(
      position,
      this.uniforms.cameraHigh.value,
      this.uniforms.cameraLow.value,
    );
  }

  setCameraRotation(matrix: Matrix4): void {
    this.uniforms.rotation.value.extractRotation(matrix);
  }
}
