import React, { useEffect, useRef } from "react";

const App: React.FC = () => {
  const ref = useRef(null);
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      const key = e.key;
      // switch (key) {
      //   case
      // }
    };

    (document as Document).addEventListener("keypress", keyHandler);
    return () =>
      (document as Document).removeEventListener("keydown", keyHandler);
  }, []);
  return (
    <div
      ref={ref}
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      zditor
    </div>
  );
};
export default App;
