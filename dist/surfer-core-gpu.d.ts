export class SurferCoreGpu {
    protected readonly cdy: CindyJS;
    readonly element: HTMLElement;
    readonly canvas: HTMLCanvasElement;
    protected expression: string;
    protected alpha: number;
    protected zoom: number;
    protected parameters: {
        [key: string]: number;
    };
    private constructor();
    getExpression(): string;
    getAlpha(): number;
    getZoom(): number;
    getParameter(name: string): number | undefined;
    getParameters(): {
        [key: string]: number;
    };
    getParameterNames(): string[];
    setExpression(expression: string): this;
    setAlpha(alpha: number): this;
    setZoom(zoom: number): this;
    setParameter(name: string, value: number): this;
    static create(container: HTMLElement, width?: number, height?: number): Promise<SurferCoreGpu>;
}
export default SurferCoreGpu;

//# sourceMappingURL=surfer-core-gpu.d.ts.map
