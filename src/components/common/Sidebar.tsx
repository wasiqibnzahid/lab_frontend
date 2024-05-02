import { Sidebar } from "flowbite-react";
import { HiChartPie, HiTemplate, HiCalculator } from "react-icons/hi";
import Modal from "../home/Modal";
interface Props {
  changeView: (isHome: boolean) => void;
}
function SidebarComponent({ changeView }: Props) {
  return (
    <Sidebar
      theme={{
        root: {
          base: "bg-[#24344b] h-screen w-full sticky top-0 overflow-y-auto",
          inner: "bg-[#24344b]",
        },

        item: {
          content: {
            base: "text-white w-full pl-2",
          },
          icon: {
            base: "text-[#9ca3af] h-6  w-6 ",
          },
          base: "flex hover:bg-[#2a3b53] duration-300 px-2 py-4",
        },
      }}
      aria-label="Sidebar"
    >
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <h2 className="text-xl text-center pt-3 font-semibold text-white uppercase tracking-wide pl-2">
            Lab Results
          </h2>
          <Sidebar.Item
            onClick={() => changeView(true)}
            className="cursor-pointer"
            icon={HiChartPie}
          >
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item icon={HiTemplate}>
            <Modal />
          </Sidebar.Item>
          <Sidebar.Item
            className="cursor-pointer"
            onClick={() => changeView(false)}
            icon={HiCalculator}
          >
            View Metrics
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default SidebarComponent;
