const input = document.getElementById("inp");

const sliderParamA = document.getElementById("sliderParamA");
const sliderAlpha = document.getElementById("sliderAlpha");
const sliderZoom = document.getElementById("sliderZoom");

async function init() {
  CindyJS.registerPlugin(1, "surfer-js-core-gpu", (api) => {
    api.defineFunction("csinitDone", 0, () => {
      updateImplicitFunction(input.value);
      updateParamA(sliderParamA.valueAsNumber);
      updateAlpha(sliderAlpha.valueAsNumber);
      updateZoom(sliderZoom.valueAsNumber);
    });
  });
  window.cdy = CindyJS.newInstance({
    canvasname: "CSCanvas",
    scripts: {
      init: await (
        await fetch(
          new URL("./src/cindyscript/init.cindyscript", window.location.href)
        )
      ).text(),
      draw: await (
        await fetch(
          new URL("./src/cindyscript/draw.cindyscript", window.location.href)
        )
      ).text(),
      mousedown: await (
        await fetch(
          new URL(
            "./src/cindyscript/mousedown.cindyscript",
            window.location.href
          )
        )
      ).text(),
      mouseup: await (
        await fetch(
          new URL("./src/cindyscript/mouseup.cindyscript", window.location.href)
        )
      ).text(),
    },
    animation: { autoplay: true },
    use: ["CindyGL", "symbolic", "surfer-js-core-gpu"],
    ports: [
      {
        id: "CSCanvas",
        width: 500,
        height: 500,
        transform: [{ visibleRect: [-0.7, -0.5, 0.7, 0.5] }],
      },
    ],
  });
  window.cdy.startup();
}

const updateImplicitFunction = (expr) =>
  cdy.evokeCS("fun(x,y,z) := (" + expr + "); init();");
const updateParamA = (value) => cdy.evokeCS(`a = ${value};`);
const updateAlpha = (value) => cdy.evokeCS(`alpha = ${value};`);
const updateZoom = (value) => cdy.evokeCS(`zoom = exp(${value});`);

init().then();

input.addEventListener("keypress", (event) =>
  event.code === "Enter" ? updateImplicitFunction(input.value) : false
);

sliderParamA.addEventListener("input", () =>
  updateParamA(sliderParamA.valueAsNumber)
);
sliderAlpha.addEventListener("input", () =>
  updateAlpha(sliderAlpha.valueAsNumber)
);
sliderZoom.addEventListener("input", () =>
  updateZoom(sliderZoom.valueAsNumber)
);
