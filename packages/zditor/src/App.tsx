import { Rect } from "zim-leafer";
const App: React.FC = () => {
  return (
    <Rect
      {...{
        width: 100,
        height: 100,
        x: 100,
        y: 100,
        stroke: "red",
      }}
    ></Rect>
  );
};
export default App;
