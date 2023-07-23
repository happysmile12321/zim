export function parseStructuredText(data) {
  if (data == null) {
    return "";
  }
  let doms = [];
  let nodes = [];
  let pdf_w = [];
  let html_w = [];
  let text_len = [];
  for (let block of data.blocks) {
    if (block.type === "text") {
      for (let line of block.lines) {
        let text = document.createElement("span");
        text.style.left = line.bbox.x + "px";
        text.style.top = line.y - line.font.size * 0.8 + "px";
        text.style.height = line.bbox.h + "px";
        text.style.fontSize = line.font.size + "px";
        text.style.fontFamily = line.font.family;
        text.style.fontWeight = line.font.weight;
        text.style.fontStyle = line.font.style;
        text.textContent = line.text;
        doms.push(text);
        pdf_w.push(line.bbox.w);
        text_len.push(line.text.length - 1);
      }
    }
  }
  for (let i = 0; i < nodes.length; ++i)
    if (text_len[i] > 0) html_w[i] = nodes[i].clientWidth;
  for (let i = 0; i < nodes.length; ++i)
    if (text_len[i] > 0)
      nodes[i].style.letterSpacing =
        (pdf_w[i] - html_w[i]) / text_len[i] + "px";
  return doms
    .map((e) => {
      e.style.position = "absolute";
      e.style.color = "transparent";
      return e.outerHTML;
    })
    .join("");
}
