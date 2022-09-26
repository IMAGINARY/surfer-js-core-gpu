# surfer-core-gpu

This package provides a WebGL (actually, CindyJS and CindyGL) based renderer for
algebraic surfaces. It can also be used for other types of implicit surfaces.
However, the quality of the results may vary a lot.

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
```

The `SurferGpuCore` object exposes two internal elements:

- `canvas`: A `HTMLCanvasElement` that is used for drawing the surface. This
  element should not be modified, but its properties can be read safely.
- `element`: A `HTMLDivElement` used as a container for the `canvas`. Additional
  CSS properties such as background color, width and height can be applied to
  this element.

## Bundled CindyJS

This package uses the [CindyJS](https://cindyjs.org) package internally. Since
CindyJS is not published through NPM, you can either add the libraries from the
`vendor` folder to your project manually (via `<script>` tags), or you change
your imports to

```typescript
import '@imaginary-maths/surfer-core-gpu/dist/surfer-core-gpu-bundled-cindyjs';
```

# Demo

<iframe src="demo.html" width="100%" height="700"></iframe>

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
