import { Skeleton, Menu } from "antd";
import { useState } from "react";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const PdfAside = ({ outline, setCurrentPage }) => {
  if (!outline) {
    return <Skeleton />;
  }
  const [current, setCurrent] = useState(0);
  const onClick = ({ key }) => {
    setCurrentPage(~~key + 1);
  };
  return (
    <Menu
      onClick={onClick}
      style={{
        width: 256,
      }}
      selectedKeys={[current]}
      mode="inline"
      items={outline.map(({ title, page }) => {
        return getItem(title, page);
      })}
    />
  );
};
export default PdfAside;
