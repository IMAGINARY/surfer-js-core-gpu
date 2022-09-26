/* eslint-disable max-classes-per-file */

/**
 * Provide partial type information for CindyJS.
 * Just enough to silence the TypeScript compiler.
 */

interface ApiV1 {
  instance: CindyJS;
  defineFunction(
    name: string,
    numArgs: number,
    fun: (...args: unknown[]) => unknown,
  ): void;
}

type InstanceOptions = {
  scripts: string | { [key: string]: string };
  animation: { autoplay: boolean };
  use: string[];
  ports: [
    {
      element: HTMLCanvasElement;
      transform: [{ visibleRect: [number, number, number, number] }];
    },
  ];
};

declare interface CindyJS {
  startup(): void;

  evokeCS(code: string): void;
}

declare namespace CindyJS {
  function registerPlugin(
    apiVersion: number,
    name: string,
    callback: (api: ApiV1) => void,
  ): void;

  function newInstance(instanceOptions: InstanceOptions): CindyJS;
}
