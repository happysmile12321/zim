import Dsl from "./dsl/dsl";
import Pdf from "./pages/Pdf";

const App = (props) => {
  return (
    <>
      <Dsl>
        <Pdf {...props} />
      </Dsl>
    </>
  );
};
export default App;
