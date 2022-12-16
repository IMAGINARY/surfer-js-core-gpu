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
type Vector3 = [number, number, number];
type Light = {
    direction: Vector3;
    color: Vector3;
    gamma: number;
    cameraSpace: boolean;
};
declare class Montag {
    protected lights: Light[];
    constructor(lights?: Light[]);
    getLights(): Light[];
}
type IntersectionAlgorithm = PolynomialInterpolation;
type IlluminationModel = Montag;
export class SurferCoreGpu {
    protected readonly api: CindyJS.ApiV1;
    protected readonly cdy: CindyJS;
    readonly element: HTMLElement;
    readonly canvas: HTMLCanvasElement;
    protected intersectionAlgorithm: IntersectionAlgorithm;
    protected illumnimationModel: IlluminationModel;
    protected expression: string;
    protected twoSided: boolean;
    protected alpha: number;
    protected zoom: number;
    protected parameters: {
        [key: string]: number;
    };
    static readonly IntersectionAlgorithms: {
        readonly PolynomialInterpolation: typeof PolynomialInterpolation;
    };
    static readonly IlluminationModels: {
        readonly Montag: typeof Montag;
    };
    private constructor();
    getIntersectionAlgorithm(): IntersectionAlgorithm;
    getIlluminationModel(): IlluminationModel;
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
    setIntersectionAlgorithm(algorithm: IntersectionAlgorithm): void;
    setIlluminationModel(model: IlluminationModel): void;
    static create(container: HTMLElement, width?: number, height?: number): Promise<SurferCoreGpu>;
}
export default SurferCoreGpu;

//# sourceMappingURL=surfer-core-gpu.d.ts.map
