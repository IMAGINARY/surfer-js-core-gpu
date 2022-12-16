# surfer-core-gpu

This package provides a WebGL (actually, CindyJS and CindyGL) based renderer for
algebraic surfaces. It can also be used for other types of implicit surfaces.
However, the quality of the results may vary a lot.

Check out the [demo](https://imaginary.github.io/surfer-js-core-gpu/demo.html).

## Usage

Add the package to your project:

```shell
npm install @imaginary-maths/surfer-core-gpu
```

Import the main class, instantiate and modify:

```typescript
import '@imaginary-maths/surfer-core-gpu';

// ...

const container = document.getElementById('my-container');
const s = await SurferCoreGpu.create(container, 512, 512);

s.setExpression('x^2+y^2+z^2+x*y*z-4*a');
s.setAlpha(0.75);
s.setZoom(0.1);
s.setParameter('a', 1);

// For translucent surfaces, having the same material for both sides often looks better.
s.setTwoSided(false);
```

Some getters are also available:

```typescript
s.getExpression();
// "x^2+y^2+z^2+x*y*z-4*a"
s.getAlpha();
// 0.75
s.getZoom();
// 0.1
s.getParameterNames();
// ["a"]
s.getParameters();
// { a: 1.0 }
s.getTwoSided();
// false
```

Basic adjustment to the illumination model are possible:

```typescript
import Montag from './montag';

const lights = [
  {
    // light emulating a front side material #1
    direction: [0, 0, -1],
    color: [0.3, 0.5, 1],
    gamma: 1,
    cameraSpace: true,
  },
  {
    // light emulating a front side material #2
    direction: [0, 0, -1],
    color: [0.5, 1, 1],
    gamma: 10,
    cameraSpace: true,
  },
  {
    // light emulating a back side material #1
    direction: [0, 0, 1],
    color: [1, 0.2, 0.1],
    gamma: 1,
    cameraSpace: true,
  },
  {
    // light emulating a back side material #2
    direction: [0, 0, 1],
    color: [1, 1, 0.5],
    gamma: 10,
    cameraSpace: true,
  },
  {
    // light that is fixed in the scene #1
    direction: [-10, 10, -2],
    color: [0.63, 0.72, 0.27],
    gamma: 5,
    cameraSpace: false,
  },
  {
    // light that is fixed in the scene #2
    direction: [10, -8, 3],
    color: [0.54, 0.09, 0.54],
    gamma: 5,
    cameraSpace: false,
  },
];

// Aaron Montag's custom illumination model
const Montag = SurferCoreGpu.IlluminationModels.Montag;

s.setIlluminationModel(new Montag(lights));
```

Some elements of the intersection algorithm can be tweaked as well:

```typescript
const PolynomialInterpolation =
  SurferCoreGpu.IntersectionAlgorithms.PolynomialInterpolation;

// For some non-algebraic functions, Chebyshev nodes yield better results.
// Explictly set the maximum degree of the interpolating function for experimentation.
const algorithm0 = new PolynomialInterpolation(
  PolynomialInterpolation.nodeGeneratorChebyshev(),
  11,
);
s.setAlgorithm(algorithm);

// Equidistant nodes are the default and yield good results if the zoom parameter is rather small.
const algorithm1 = new PolynomialInterpolation(
  PolynomialInterpolation.nodeGeneratorEquidistant(),
);
s.setAlgorithm(algorithm1);
```

The `SurferGpuCore` object exposes two internal elements:

- `canvas`: A `HTMLCanvasElement` that is used for drawing the surface. This
  element should not be modified, but its properties can be read safely.
- `element`: A `HTMLDivElement` used as a container for the `canvas`. Additional
  CSS properties such as background color, width and height can be applied to
  this element.

## Bundled CindyJS

This package uses the [CindyJS](https://cindyjs.org) package internally. Since
CindyJS is not published through NPM, you can add the libraries from the
`vendor` folder to your project manually (via `<script>` tags).

# Build

```shell
npm install
npm run build
```

## Credits

Created by [Christian Stussak](https://github.com/porst17) for IMAGINARY gGmbH,
based on a prototype by [Aaron Montag](https://github.com/montaga).

## License

Copyright 2022 IMAGINARY gGmbH

Licensed under the Apache v2.0 license (see the [`LICENSE`](./LICENSE) file).
