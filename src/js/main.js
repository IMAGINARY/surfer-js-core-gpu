const container = document.getElementById("container");

const input = document.getElementById("inp");

const sliderParamA = document.getElementById("sliderParamA");
const sliderAlpha = document.getElementById("sliderAlpha");
const sliderZoom = document.getElementById("sliderZoom");

async function init(element) {
  const canvas = element.ownerDocument.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  element.appendChild(canvas);
  CindyJS.registerPlugin(1, "surfer-js-core-gpu", (api) => {
    api.defineFunction("csinitDone", 0, () => {
      updateImplicitFunction(input.value);
      updateParamA(sliderParamA.valueAsNumber);
      updateAlpha(sliderAlpha.valueAsNumber);
      updateZoom(sliderZoom.valueAsNumber);
      updateAspectRatio(canvas);

      // keep the
      const resizeObserver = new ResizeObserver(() => updateAspectRatio(canvas));
      resizeObserver.observe(canvas);
    });
  });
  window.cdy = CindyJS.newInstance({
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
        element: canvas,
        transform: [{ visibleRect: [-0.51, -0.51, 0.51, 0.51] }],
      },
    ],
  });
  window.cdy.startup();
  return canvas.parentElement;
}

const updateImplicitFunction = (expr) =>
  cdy.evokeCS("fun(x,y,z) := (" + expr + "); init();");
const updateParamA = (value) => cdy.evokeCS(`a = ${value};`);
const updateAlpha = (value) => cdy.evokeCS(`alpha = ${value};`);
const updateZoom = (value) => cdy.evokeCS(`zoom = 2^(${value});`);

init(container).then((div) => div.classList.add("surface"));

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

function updateAspectRatio(canvas) {
  const aspectRatio = canvas.width / canvas.height;
  cdy.evokeCS(`aspectRatio = ${aspectRatio};`);
}
