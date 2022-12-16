export type Vector3 = [number, number, number];

export type Light = {
  direction: Vector3;
  color: Vector3;
  gamma: number;
  cameraSpace: boolean;
};

function getDefaultLights(): Light[] {
  return [
    {
      direction: [0, 0, -1],
      color: [0.3, 0.5, 1],
      gamma: 1,
      cameraSpace: true,
    },
    {
      direction: [0, 0, -1],
      color: [0.5, 1, 1],
      gamma: 10,
      cameraSpace: true,
    },
    {
      direction: [0, 0, 1],
      color: [1, 0.2, 0.1],
      gamma: 1,
      cameraSpace: true,
    },
    {
      direction: [0, 0, 1],
      color: [1, 1, 0.5],
      gamma: 10,
      cameraSpace: true,
    },
    {
      direction: [-10, 10, -2],
      color: [0.63, 0.72, 0.27],
      gamma: 5,
      cameraSpace: false,
    },
    {
      direction: [10, -8, 3],
      color: [0.54, 0.09, 0.54],
      gamma: 5,
      cameraSpace: false,
    },
  ];
}

export default class Montag {
  protected lights: Light[];

  constructor(lights: Light[] = getDefaultLights()) {
    this.lights = lights;
  }

  getLights(): Light[] {
    return this.lights;
  }
}
