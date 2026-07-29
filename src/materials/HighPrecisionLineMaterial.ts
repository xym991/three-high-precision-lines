import {
  Color,
  Matrix4,
  ShaderMaterial,
  Vector3,
  type ColorRepresentation,
} from "three";

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
    viewRotation: { value: Matrix4 };
    objectLinearTransform: { value: Matrix4 };
    diffuse: { value: Color };
    opacity: { value: number };
  };

  constructor(parameters: HighPrecisionLineMaterialParameters = {}) {
    super({
      uniforms: {
        cameraHigh: { value: new Vector3() },
        cameraLow: { value: new Vector3() },

        viewRotation: { value: new Matrix4() },
        objectLinearTransform: { value: new Matrix4() },

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

        uniform mat4 viewRotation;
        uniform mat4 objectLinearTransform;

        void main() {

            vec3 relative =
                (positionHigh - cameraHigh) +
                (positionLow - cameraLow);

            relative =
                (objectLinearTransform * vec4(relative, 0.0)).xyz;

            gl_Position =
                projectionMatrix *
                viewRotation *
                vec4(relative, 1.0);

        }
      `,

      fragmentShader: `
        uniform vec3 diffuse;
        uniform float opacity;

        void main() {
            gl_FragColor = vec4(diffuse, opacity);
        }
      `,

      transparent: parameters.transparent ?? false,
    });

    this.opacity = parameters.opacity ?? 1;
  }

  get color(): Color {
    return this.uniforms.diffuse.value;
  }
}
