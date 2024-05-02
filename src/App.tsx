import { Flowbite } from "flowbite-react";
import SidebarComponent from "./components/common/Sidebar";
import Home from "./components/home/HomePage";
import { useState } from "react";
import Metrics from "./components/Metrics";

function App() {
  const [showHome, setShowHome] = useState(false);
  return (
    <Flowbite>
      <div className="flex flex-nowrap ">
        <div className="w-64 relative z-50">
          <SidebarComponent changeView={setShowHome} />
        </div>
        <div className="w-full px-3">{showHome ? <Home /> : <Metrics />}</div>
      </div>
    </Flowbite>
  );
}

export default App;
