const input = document.getElementById("inp");

async function init() {
  CindyJS.registerPlugin(1, "surfer-js-core-gpu", (api) => {
    api.defineFunction("csinitDone", 0, () => {
      updateImplicitFunction(input.value);
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
    geometry: [
      {
        name: "PA",
        kind: "P",
        type: "Free",
        pos: [0.5, 0.37, 1],
        narrow: true,
        color: [1, 1, 1],
        size: 8,
      },
      {
        name: "PB",
        kind: "P",
        type: "Free",
        pos: [0.5, 0.5, 1],
        narrow: true,
        color: [1, 1, 1],
        size: 8,
      },
      {
        name: "PC",
        kind: "P",
        type: "Free",
        pos: [0.5, 0.1, 1],
        narrow: true,
        color: [1, 1, 1],
        size: 8,
      },
    ],
    ports: [
      {
        id: "CSCanvas",
        width: 700,
        height: 500,
        transform: [{ visibleRect: [-0.7, -0.5, 0.7, 0.5] }],
      },
    ],
  });
  window.cdy.startup();
}

function updateImplicitFunction(expr) {
  cdy.evokeCS("fun(x,y,z) := (" + expr + "); init();");
}

init().then();

input.addEventListener("keypress", (event) =>
  event.code === "Enter" ? updateImplicitFunction(input.value) : false
);
