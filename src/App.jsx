
import { Provider } from "react-redux";
import AllRoutes from "./Components/AllRoutes";
import store from "./Redux/store";


function App() {
  return (
    <>
      <div className="bg-slate-200 text-2xl">
        <Provider store={store}>
        <AllRoutes />
        </Provider>
        

      </div>
    </>
  );
}

export default App;
