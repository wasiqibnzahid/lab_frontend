import { Flowbite } from "flowbite-react";
import SidebarComponent from "./components/common/Sidebar";
import Home from "./components/home/HomePage";

function App() {
  return (
    <Flowbite>
      <div className="flex flex-nowrap ">
        <div className="w-64 relative z-50">
          <SidebarComponent />
        </div>
        <div className="w-full px-3">
          <Home />
        </div>
      </div>
    </Flowbite>
  );
}

export default App;
