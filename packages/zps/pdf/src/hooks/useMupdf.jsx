import { useEffect, useState } from "react";
import MuBackend from "../oo/MuBackend";

const doc = new MuBackend();
const useMuPdf = ({ url, currentPage, setCurrentPage }) => {
  const [loading, setLoading] = useState(true);
  const [docInfo, setDocInfo] = useState(null);
  const [renderedSvg, setRenderedSvg] = useState(null);
  const [outline, setOutline] = useState(null);
  const [text, setText] = useState(null);
  const [dpi, setDpi] = useState(96);
  const [pageRect, setPageRect] = useState({
    width: 0,
    height: 0,
  });
  const [zoom, setZoom] = useState(100);
  const zoomLevels = [
    50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110, 120, 130, 140, 150, 160,
    170, 180, 190, 200,
  ];
  const onZoom = async (zoom, newZoom, doc, setPageRect, setDpi, docInfo) => {
    if (zoom === newZoom) return;
    setZoom(newZoom);
    const di = ((newZoom * 96) / 100) | 0;
    setDpi(di);
    if (docInfo) {
      let defaultW = await doc.mu_pageWidthDpi(
        docInfo.pagesCount > 1 ? 2 : 1,
        di
      );
      let defaultH = await doc.mu_pageHeightDpi(
        docInfo.pagesCount > 1 ? 2 : 1,
        di
      );
      setPageRect({
        width: defaultW,
        height: defaultH,
      });
    }
  };
  useEffect(() => {
    const fdata = async () => {
      await doc._init(url);
      setLoading(false);
      const pageInfo = await doc.pageInfo;
      setDocInfo(pageInfo);
      const outine = await doc.interact.getOutline();
      setOutline(outine);
    };
    fdata();
  }, []);
  useEffect(() => {
    if (loading) {
      return;
    }
    const fdata = async () => {
      const svg = await doc.render.renderSVG(currentPage);
      let svgdomContainer = document.createElement("div");
      svgdomContainer.innerHTML = svg;
      let svgdom = svgdomContainer.children[0];
      if (pageRect.width != 0) {
        svgdom.style.width = pageRect.width + "px";
        svgdom.style.height = pageRect.height + "px";
      }
      setRenderedSvg(svgdom.outerHTML);
      const text = JSON.parse(await doc.render.renderText(currentPage, dpi));
      setText(text);
    };
    fdata();
  }, [currentPage, loading, pageRect]);
  return {
    loading,
    docInfo,
    currentPage,
    setCurrentPage,
    renderedSvg,
    text,
    zoom,
    zoomLevels,
    onZoom,
    doc,
    setPageRect,
    setDpi,
    setZoom,
    pageRect,
    outline,
  };
};
export default useMuPdf;
