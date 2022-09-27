type NodeGenerator = (degree: number) => number[];
declare class PolynomialInterpolation {
    protected minDegree: number;
    protected maxDegree: number;
    protected nodeGenerator: NodeGenerator;
    constructor(nodeGenerator?: NodeGenerator, maxDegree?: number, minDegree?: number);
    getMinDegree(): number;
    getMaxDegree(): number;
    generateNodes(degree: number): number[];
    static nodeGeneratorEquidistant(): NodeGenerator;
    static nodeGeneratorChebyshev(): NodeGenerator;
}
export class SurferCoreGpu {
    protected readonly api: CindyJS.ApiV1;
    protected readonly cdy: CindyJS;
    readonly element: HTMLElement;
    readonly canvas: HTMLCanvasElement;
    protected algorithm: PolynomialInterpolation;
    protected expression: string;
    protected twoSided: boolean;
    protected alpha: number;
    protected zoom: number;
    protected parameters: {
        [key: string]: number;
    };
    static readonly Algorithms: {
        readonly PolynomialInterpolation: typeof PolynomialInterpolation;
    };
    private constructor();
    getAlgorithm(): PolynomialInterpolation;
    getExpression(): string;
    getTwoSided(): boolean;
    getAlpha(): number;
    getZoom(): number;
    getParameter(name: string): number | undefined;
    getParameters(): {
        [key: string]: number;
    };
    getParameterNames(): string[];
    setExpression(expression: string): this;
    setTwoSided(hasTwoSides: boolean): this;
    setAlpha(alpha: number): this;
    setZoom(zoom: number): this;
    setParameter(name: string, value: number): this;
    setAlgorithm(algorithm: PolynomialInterpolation): void;
    static create(container: HTMLElement, width?: number, height?: number): Promise<SurferCoreGpu>;
}
export default SurferCoreGpu;

//# sourceMappingURL=surfer-core-gpu.d.ts.map
