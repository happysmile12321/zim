import { useEffect } from "react";

const useMupdfAction = ({
  setCurrentPage,
  hooks,
  pagesCount,
  currentPage,
  onZoom,
  zoomLevels,
  doc,
  setPageRect,
  setDpi,
  zoom,
  setZoom,
  docInfo,
}) => {
  useEffect(() => {
    let curr = zoomLevels.indexOf(zoom);
    let next = zoomLevels[curr + 1];
    if (next) {
      onZoom(zoom, next, doc, setPageRect, setDpi, docInfo);
      setZoom(next);
    }
  }, [hooks.doEnLarge]);

  useEffect(() => {
    let curr = zoomLevels.indexOf(zoom);
    let next = zoomLevels[curr - 1];
    if (next) {
      onZoom(zoom, next, doc, setPageRect, setDpi, docInfo);
      setZoom(next);
    }
  }, [hooks.doShrink]);

  useEffect(() => {
    if (currentPage < pagesCount) {
      setCurrentPage((page) => page + 1);
    }
  }, [hooks.doNext]);
  useEffect(() => {
    if (currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  }, [hooks.doPrev]);
};
export default useMupdfAction;
