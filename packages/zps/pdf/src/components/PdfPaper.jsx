import { parseStructuredText } from "../utils";
const PdfPaper = ({ docInfo, renderedSvg, renderedText, pageRect }) => {
  return (
    <>
      <div
        style={{
          position: "relative",
          width: pageRect.width + "px",
          height: pageRect.height + "px",
        }}
        dangerouslySetInnerHTML={{
          __html: `
          ${renderedSvg} 
          ${parseStructuredText(renderedText)}
          `,
        }}
      ></div>
    </>
  );
};
export default PdfPaper;
