# three-high-precision-lines

High precision line rendering for Three.js using camera-relative coordinates.

`three-high-precision-lines` eliminates floating-point precision artifacts when rendering lines at extremely large world coordinates, making it suitable for astronomy visualizations, planetary simulations, space games, geospatial applications, and other large-scale scenes.

## Features

- Camera-relative high precision rendering
- Works at millions or billions of world units from the origin
- TypeScript support included
- Familiar Three.js-style API
- Compatible with standard Three.js cameras and renderers

## Installation

```bash
npm install three three-high-precision-lines
```

## Why?

Three.js stores vertex positions using 32-bit floating point values on the GPU.

At large distances from the world origin, precision is lost and lines begin to jitter, wobble, or break apart as the camera moves.

This package solves that problem by:

1. Splitting world positions into high and low precision components
2. Uploading both components to the GPU
3. Reconstructing camera-relative coordinates in the vertex shader

This preserves significantly more precision than standard line rendering.

## Basic Usage

```ts
import {
  HighPrecisionLine,
  HighPrecisionLineGeometry,
  HighPrecisionLineMaterial,
} from "three-high-precision-lines";

const geometry = new HighPrecisionLineGeometry({
  positions: [10000000, 0, 0, 0, 0, 10000000, -10000000, 0, 0],
});

const material = new HighPrecisionLineMaterial({
  color: 0x00ff00,
});

const line = new HighPrecisionLine(geometry, material);

scene.add(line);
```

## Camera Updates

The material must be updated whenever the camera position or orientation changes.

Typically this is done once per frame:

```ts
function animate() {
  requestAnimationFrame(animate);

  material.setCamera(camera);

  renderer.render(scene, camera);
}
```

## Creating Geometry

### From Flat Position Arrays

```ts
const geometry = new HighPrecisionLineGeometry({
  positions: [x1, y1, z1, x2, y2, z2, x3, y3, z3],
});
```

### From Points

```ts
const geometry = new HighPrecisionLineGeometry();

geometry.setFromPoints([
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(10000000, 0, 0),
  new THREE.Vector3(20000000, 0, 0),
]);
```

## Example

```ts
const geometry = new HighPrecisionLineGeometry({
  positions,
});

const material = new HighPrecisionLineMaterial({
  color: 0x00ff00,
});

const orbit = new HighPrecisionLine(geometry, material);

scene.add(orbit);

function animate() {
  requestAnimationFrame(animate);

  material.setCamera(camera);

  renderer.render(scene, camera);
}
```

## API

### HighPrecisionLine

A line object that renders using camera-relative high precision coordinates.

```ts
new HighPrecisionLine(
  geometry?,
  material?,
);
```

### HighPrecisionLineGeometry

Geometry storing split high and low precision position buffers.

```ts
new HighPrecisionLineGeometry({
  positions?,
});
```

#### Methods

```ts
setFromPositions(positions);
setFromPoints(points);
setPositionsHigh(positionsHigh);
setPositionsLow(positionsLow);
```

### HighPrecisionLineMaterial

Shader material responsible for reconstructing camera-relative coordinates.

```ts
new HighPrecisionLineMaterial({
  color?,
  opacity?,
  transparent?,
});
```

#### Methods

```ts
setCamera(camera);
setCameraPosition(position);
setCameraRotation(matrix);
```

## Use Cases

- Astronomy visualizations
- Solar system simulators
- Space games
- Planetary rendering
- Geospatial applications
- Scientific visualization
- Large-scale simulations

## License

MIT

## Acknowledgements

Inspired by large-scale rendering techniques used in scientific visualization, astronomy software, and game engines. Originally developed while building Astrarium, a real-time astronomy and solar-system visualization project.
