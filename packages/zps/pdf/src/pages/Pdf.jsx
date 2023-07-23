import React, { useEffect } from "react";
import useMuPdf from "../hooks/useMupdf";
import { Button, Col, Row, Skeleton } from "antd";
import PdfPaper from "../components/PdfPaper";
import PdfAside from "../components/PdfAside";
import useMupdfAction from "../hooks/useMupdfAction";

const Pdf = ({ hooks, url = "/test.pdf" }) => {
  const {
    loading,
    docInfo,
    currentPage,
    renderedSvg,
    setCurrentPage,
    text,
    onZoom,
    doc,
    setPageRect,
    setDpi,
    zoomLevels,
    zoom,
    setZoom,
    pageRect,
    outline,
  } = useMuPdf({
    url,
    currentPage: hooks.doCurrentPage,
    setCurrentPage: hooks.setDoCurrentPage,
  });
  useMupdfAction({
    setCurrentPage,
    hooks,
    currentPage,
    pagesCount: docInfo?.pagesCount ?? 0,
    onZoom,
    zoomLevels,
    doc,
    setPageRect,
    setDpi,
    zoom,
    setZoom,
    docInfo,
  });
  if (loading) {
    return <Skeleton loading={loading}></Skeleton>;
  }

  return (
    <>
      <Row>
        <Col span={1}>
          <Button
            type="primary"
            onClick={() => hooks.setDoPrev((reload) => ~reload)}
          >
            prev
          </Button>
        </Col>
        <Col span={1}>
          <Button
            type="primary"
            onClick={() => hooks.setDoNext((reload) => ~reload)}
          >
            next
          </Button>
        </Col>
        <Col span={1}>
          <Button
            type="primary"
            onClick={() => hooks.setDoShrink((reload) => ~reload)}
          >
            small
          </Button>
        </Col>
        <Col span={1}>
          <Button
            type="primary"
            onClick={() => hooks.setDoEnLarge((reload) => ~reload)}
          >
            large
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={6}>
          <PdfAside outline={outline} setCurrentPage={hooks.setDoCurrentPage} />
        </Col>
        <Col span={18}>
          <PdfPaper
            pageRect={pageRect}
            hooks={hooks}
            docInfo={docInfo}
            renderedSvg={renderedSvg}
            renderedText={text}
          ></PdfPaper>
        </Col>
      </Row>
    </>
  );
};
export default Pdf;
