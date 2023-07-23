import { Leafer, LeaferEvent, Frame, Text } from "leafer-ui";

const leafer = new Leafer({ view: window });
leafer.on(LeaferEvent.READY, () => {
  console.log("ready");
});
leafer.on(LeaferEvent.VIEW_READY, () => {
  console.log("view ready");
});

const width = leafer.canvas.width;
const height = leafer.canvas.height;
//draw zim canvas
const frame = new Frame({
  width: width,
  height: height,
});

leafer.add(frame);
let colWidth = 0;
let rowWidth = 0;
document.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key == "Enter") {
    colWidth = 0;
    rowWidth += 16;
    return;
  }
  const t = new Text({
    fill: "black",
    text: e.key,
  });
  colWidth += 16;
  if (colWidth > width) {
    colWidth = 0;
    rowWidth += 16;
  }
  t.set({
    x: colWidth,
    y: rowWidth,
    width: 16,
    height: 16,
  });
  if (rowWidth > height) {
    frame.set({
      height: rowWidth,
    });
  }
  frame.add(t);
});
