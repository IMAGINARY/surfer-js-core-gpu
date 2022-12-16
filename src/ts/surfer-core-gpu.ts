import 'CindyJS';

import csInitPrefix from 'bundle-text:../cindyscript/init.cindyscript';
import csDraw from 'bundle-text:../cindyscript/draw.cindyscript';
import csMouseDown from 'bundle-text:../cindyscript/mousedown.cindyscript';
import csMouseUp from 'bundle-text:../cindyscript/mouseup.cindyscript';

import PolynomialInterpolation from './intersection-algorithms/polynomial-interpolation';

import Montag from './illumination-models/montag';

const csInit = `${csInitPrefix}; csInitDone();`;

const cdyInstanceDataMap = new Map<
  CindyJS,
  { onInit: (api: CindyJS.ApiV1) => void }
>();

CindyJS.registerPlugin(1, 'surfer-js-core-gpu', (api) => {
  const cdy = api.instance;
  const cdyData = cdyInstanceDataMap.get(cdy);

  if (typeof cdyData === 'undefined')
    throw new Error('Unknown CindyJS instance.');

  const { onInit } = cdyData;
  api.defineFunction('csInitDone', 0, () => onInit(api));
});

type IntersectionAlgorithm = PolynomialInterpolation;
type IlluminationModel = Montag;

export default class SurferCoreGpu {
  protected readonly api: CindyJS.ApiV1;

  protected readonly cdy: CindyJS;

  public readonly element: HTMLElement;

  public readonly canvas: HTMLCanvasElement;

  protected intersectionAlgorithm: IntersectionAlgorithm;

  protected illumnimationModel: IlluminationModel;

  protected expression = 'x^2 - 1';

  protected twoSided = true;

  protected alpha = 1.0;

  protected zoom = 1.0;

  protected parameters: { [key: string]: number } = {};

  public static readonly IntersectionAlgorithms: {
    readonly PolynomialInterpolation: typeof PolynomialInterpolation;
  } = {
    PolynomialInterpolation,
  };

  public static readonly IlluminationModels: {
    readonly Montag: typeof Montag;
  } = {
    Montag,
  };

  private constructor(
    api: CindyJS.ApiV1,
    element: HTMLElement,
    canvas: HTMLCanvasElement,
  ) {
    this.api = api;
    this.cdy = api.instance;
    this.element = element;
    this.canvas = canvas;

    const interpolationNodeGenerator =
      PolynomialInterpolation.nodeGeneratorChebyshev();
    this.intersectionAlgorithm = new PolynomialInterpolation(
      interpolationNodeGenerator,
      7,
    );
    this.illumnimationModel = new Montag();

    this.defineCindyScriptFunctions();

    this.setIntersectionAlgorithm(this.intersectionAlgorithm);
    this.setIlluminationModel(this.illumnimationModel);
    this.setExpression(this.expression);
    this.setTwoSided(this.twoSided);
    this.setAlpha(this.alpha);
    this.setZoom(this.zoom);

    Object.entries(this.parameters).forEach(([name, value]) =>
      this.setParameter(name, value),
    );
  }

  private defineCindyScriptFunctions(): void {
    const toCSTypeListOfNumbers = (a: number[]) => ({
      ctype: 'list',
      value: a.map((e) => ({ ctype: 'number', value: { real: e, imag: 0 } })),
    });

    const toCSTypeListOfListOfNumbers = (aa: number[][]) => ({
      ctype: 'list',
      value: aa.map((a) => toCSTypeListOfNumbers(a)),
    });

    const defineGetInterpolationNodes = () => {
      const getInterpolationNodesCS = (args: unknown[]) => {
        const degree = this.api.evaluateAndVal<CindyJS.Number>(args[0]).value
          .real;
        const nodes = this.getIntersectionAlgorithm().generateNodes(degree);
        return toCSTypeListOfNumbers(nodes);
      };
      this.api.defineFunction(
        'getInterpolationNodes',
        1,
        getInterpolationNodesCS,
      );
    };

    const defineGetIlluminationData = () => {
      const getCameraSpaceLightDirections = () =>
        toCSTypeListOfListOfNumbers(
          this.getIlluminationModel()
            .getLights()
            .filter(({ cameraSpace }) => cameraSpace)
            .map(({ direction }) => direction),
        );
      const getSurfaceSpaceLightDirections = () =>
        toCSTypeListOfListOfNumbers(
          this.getIlluminationModel()
            .getLights()
            .filter(({ cameraSpace }) => !cameraSpace)
            .map(({ direction }) => direction),
        );
      const getLightColors = () =>
        toCSTypeListOfListOfNumbers(
          this.getIlluminationModel()
            .getLights()
            .map(({ color }) => color),
        );
      const getLightGammas = () =>
        toCSTypeListOfNumbers(
          this.getIlluminationModel()
            .getLights()
            .map(({ gamma }) => gamma),
        );
      this.api.defineFunction(
        'getCameraSpaceLightDirections',
        0,
        getCameraSpaceLightDirections,
      );
      this.api.defineFunction(
        'getSurfaceSpaceLightDirections',
        0,
        getSurfaceSpaceLightDirections,
      );
      this.api.defineFunction('getLightColors', 0, getLightColors);
      this.api.defineFunction('getLightGammas', 0, getLightGammas);
    };

    defineGetInterpolationNodes();
    defineGetIlluminationData();
  }

  getIntersectionAlgorithm(): IntersectionAlgorithm {
    return this.intersectionAlgorithm;
  }

  getIlluminationModel(): IlluminationModel {
    return this.illumnimationModel;
  }

  getExpression(): string {
    return this.expression;
  }

  getTwoSided(): boolean {
    return this.twoSided;
  }

  getAlpha(): number {
    return this.alpha;
  }

  getZoom(): number {
    return this.zoom;
  }

  getParameter(name: string): number | undefined {
    return this.parameters[name];
  }

  getParameters(): { [key: string]: number } {
    return { ...this.parameters };
  }

  getParameterNames(): string[] {
    return Object.keys(this.parameters);
  }

  setExpression(expression: string): this {
    this.expression = expression;
    this.cdy.evokeCS(`fun(x,y,z) := (${expression}); init();`);
    return this;
  }

  setTwoSided(hasTwoSides: boolean): this {
    this.twoSided = hasTwoSides;
    this.cdy.evokeCS(`hasTwoSides = (${hasTwoSides ? 'true' : 'false'});`);
    return this;
  }

  setAlpha(alpha: number): this {
    this.alpha = alpha;
    this.cdy.evokeCS(`alpha = (${alpha});`);
    return this;
  }

  setZoom(zoom: number): this {
    this.zoom = zoom;
    this.cdy.evokeCS(`zoom = (${zoom});`);
    return this;
  }

  setParameter(name: string, value: number): this {
    this.parameters[name] = value;
    this.cdy.evokeCS(`${name} = (${value});`);
    return this;
  }

  setIntersectionAlgorithm(algorithm: IntersectionAlgorithm) {
    this.intersectionAlgorithm = algorithm;
    this.cdy.evokeCS(`init();`);
  }

  setIlluminationModel(model: IlluminationModel) {
    this.illumnimationModel = model;
    this.cdy.evokeCS(`init();`);
  }

  static async create(
    container: HTMLElement,
    width = 256,
    height = 256,
  ): Promise<SurferCoreGpu> {
    const canvas = container.ownerDocument.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    container.appendChild(canvas);

    const cdy = CindyJS.newInstance({
      scripts: {
        init: csInit,
        draw: csDraw,
        mousedown: csMouseDown,
        mouseup: csMouseUp,
      },
      animation: { autoplay: false },
      use: ['CindyGL', 'symbolic', 'surfer-js-core-gpu'],
      ports: [
        {
          element: canvas,
          transform: [{ visibleRect: [-0.51, -0.51, 0.51, 0.51] }],
        },
      ],
    });

    return new Promise<SurferCoreGpu>((resolve) => {
      const onInit = (api: CindyJS.ApiV1) => {
        const element = canvas.parentElement;
        if (element === null)
          throw new Error(
            'Something went wrong during startup of Cinderella applet',
          );

        // keep the internal and external aspect ratio in sync
        const resizeObserver = new ResizeObserver(() => {
          const aspectRatio = canvas.width / canvas.height;
          cdy.evokeCS(`aspectRatio = ${aspectRatio};`);
        });
        resizeObserver.observe(canvas);

        const surferCoreGpu = new SurferCoreGpu(api, element, canvas);
        resolve(surferCoreGpu);
      };

      cdyInstanceDataMap.set(cdy, { onInit });
      cdy.startup();
    });
  }
}
