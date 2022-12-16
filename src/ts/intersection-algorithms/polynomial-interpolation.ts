type NodeGenerator = (degree: number) => number[];

function equidistantNodes(degree: number): number[] {
  return new Array<number>(degree + 1).fill(0).map((_, i) => i / degree);
}

/**
 * Compute the Chebyshev nodes in the interval [-1,1].
 * @param k Number in [1..n]
 * @param n
 */
function chebyshev(k: number, n: number) {
  return Math.cos(((2 * k - 1) / (2 * n)) * Math.PI);
}

function chebyshev01(k: number, n: number) {
  return (chebyshev(k, n) + 1) / 2;
}

function chebyshevNodes(degree: number): number[] {
  return new Array<number>(degree + 1)
    .fill(0)
    .map((_, i) => i + 1)
    .map((k) => chebyshev01(k, degree + 1));
}

export default class PolynomialInterpolation {
  protected minDegree: number;

  protected maxDegree: number;

  protected nodeGenerator: NodeGenerator;

  constructor(
    nodeGenerator = PolynomialInterpolation.nodeGeneratorEquidistant(),
    maxDegree = Number.POSITIVE_INFINITY,
    minDegree = 0,
  ) {
    this.nodeGenerator = nodeGenerator;
    this.minDegree = Math.max(0, minDegree);
    this.maxDegree = Math.max(this.minDegree, maxDegree);
  }

  getMinDegree(): number {
    return this.minDegree;
  }

  getMaxDegree(): number {
    return this.maxDegree;
  }

  generateNodes(degree: number): number[] {
    const clampedDegree = Math.max(
      this.minDegree,
      Math.min(degree, this.maxDegree),
    );

    const nodes = this.nodeGenerator(clampedDegree).map((n) =>
      Math.max(0, Math.min(n, 1)),
    );
    nodes.length = Math.min(nodes.length);
    while (nodes.length < clampedDegree + 1) nodes.push(1);
    return nodes;
  }

  static nodeGeneratorEquidistant(): NodeGenerator {
    return equidistantNodes;
  }

  static nodeGeneratorChebyshev(): NodeGenerator {
    return chebyshevNodes;
  }
}
