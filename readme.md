# three-high-precision-lines

Render extremely large lines in Three.js without floating-point precision artifacts.

`three-high-precision-lines` uses camera-relative rendering to maintain stable, artifact-free lines even when working at planetary, astronomical, or geospatial scales. It integrates with the normal Three.js scene graph, so lines can be translated, rotated, scaled, and parented like any other object.

---

## Features

- Stable rendering at extremely large world coordinates
- Camera-relative precision without modifying your scene
- Supports normal Object3D transforms and parenting
- Drop-in replacement for standard Three.js lines
- TypeScript support included
- No per-frame setup required

---

## Installation

```bash
npm install three three-high-precision-lines
```

---

## Why?

Three.js uploads vertex positions to the GPU as 32-bit floating point values.

At very large world coordinates, subtracting two large values leaves very little precision for the actual distance between them. This causes lines to jitter, wobble, disconnect, or visibly shake as the camera moves.

`three-high-precision-lines` solves this by storing vertex positions as high and low precision components and reconstructing camera-relative coordinates directly in the vertex shader.

The result is stable rendering even when working millions or billions of units from the world origin.

---

## Basic Usage

```ts
import * as THREE from "three";

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

Nothing else is required.

Render your scene normally.

```ts
renderer.render(scene, camera);
```

---

## Creating Geometry

### From a flat position array

```ts
const geometry = new HighPrecisionLineGeometry({
  positions: [x1, y1, z1, x2, y2, z2, x3, y3, z3],
});
```

---

### From Vector3 points

```ts
const geometry = new HighPrecisionLineGeometry();

geometry.setFromPoints([
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(10000000, 0, 0),
  new THREE.Vector3(20000000, 0, 0),
]);
```

---

## Example

```ts
const orbit = new HighPrecisionLine(
  new HighPrecisionLineGeometry({
    positions,
  }),
  new HighPrecisionLineMaterial({
    color: 0x00ff00,
  }),
);

scene.add(orbit);

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}
```

---

## Scene Graph Support

`HighPrecisionLine` extends `THREE.Line`, so it behaves like any other Three.js object.

This means it can be

- translated
- rotated
- scaled
- parented to other objects
- nested within groups
- animated using the normal scene graph

without any special handling.

---

## API

### HighPrecisionLine

```ts
new HighPrecisionLine(
  geometry?,
  material?,
);
```

---

### HighPrecisionLineGeometry

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

---

### HighPrecisionLineMaterial

```ts
new HighPrecisionLineMaterial({
  color?,
  opacity?,
  transparent?,
});
```

No manual camera updates are required.

---

## Use Cases

- Astronomy visualizations
- Planetary rendering
- Solar system simulators
- Space games
- GIS and geospatial visualization
- Scientific visualization
- CAD applications
- Large-scale simulations

---

## License

MIT

---

## Acknowledgements

Originally developed for **Astrarium**, a real-time astronomy and solar system visualization project.

The implementation is inspired by camera-relative rendering techniques commonly used in scientific visualization and modern game engines.
