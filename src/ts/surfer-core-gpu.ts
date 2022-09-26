import 'CindyJS';

import csInitPrefix from 'bundle-text:../cindyscript/init.cindyscript';
import csDraw from 'bundle-text:../cindyscript/draw.cindyscript';
import csMouseDown from 'bundle-text:../cindyscript/mousedown.cindyscript';
import csMouseUp from 'bundle-text:../cindyscript/mouseup.cindyscript';

const csInit = `${csInitPrefix}; csInitDone();`;

const cdyInstanceDataMap = new Map<
  CindyJS,
  { onInit: (cdy: CindyJS) => void }
>();

CindyJS.registerPlugin(1, 'surfer-js-core-gpu', (api) => {
  const cdy = api.instance;
  const onInit = cdyInstanceDataMap.get(cdy)?.onInit;

  if (typeof onInit === 'undefined')
    throw new Error('Unknown CindyJS instance.');

  api.defineFunction('csInitDone', 0, () => onInit(cdy));
});

export default class SurferCoreGpu {
  protected readonly cdy: CindyJS;

  public readonly element: HTMLElement;

  public readonly canvas: HTMLCanvasElement;

  protected expression = 'x^2 - 1';

  protected alpha = 1.0;

  protected zoom = 1.0;

  protected parameters: { [key: string]: number } = {};

  private constructor(
    cdy: CindyJS,
    element: HTMLElement,
    canvas: HTMLCanvasElement,
  ) {
    this.cdy = cdy;
    this.element = element;
    this.canvas = canvas;

    this.setExpression(this.expression);
    this.setAlpha(this.alpha);
    this.setZoom(this.zoom);

    Object.entries(this.parameters).forEach(([name, value]) =>
      this.setParameter(name, value),
    );
  }

  getExpression(): string {
    return this.expression;
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

  static async create(
    container: HTMLElement,
    width: number,
    height: number,
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
      animation: { autoplay: true },
      use: ['CindyGL', 'symbolic', 'surfer-js-core-gpu'],
      ports: [
        {
          element: canvas,
          transform: [{ visibleRect: [-0.51, -0.51, 0.51, 0.51] }],
        },
      ],
    });

    return new Promise<SurferCoreGpu>((resolve) => {
      const onInit = () => {
        const element = canvas.parentElement;
        if (element === null)
          throw new Error(
            'Something went wrong during startup of Cinderella applet',
          );

        const surferCoreGpu = new SurferCoreGpu(cdy, element, canvas);

        // keep the internal and external aspect ratio in sync
        const resizeObserver = new ResizeObserver(() => {
          const aspectRatio = canvas.width / canvas.height;
          cdy.evokeCS(`aspectRatio = ${aspectRatio};`);
        });
        resizeObserver.observe(canvas);

        resolve(surferCoreGpu);
      };

      cdyInstanceDataMap.set(cdy, { onInit });
      cdy.startup();
    });
  }
}
