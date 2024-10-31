import React from "react";
import SidebarItem from "./SidebarItem";
import SidebarGroup from "./SidebarGroup";
import { FaCalendarAlt, FaUser, FaPills, FaUsers, FaBriefcase, FaChartBar, FaShoppingCart, FaCreditCard, FaBox, FaDesktop, FaFileAlt, FaComments } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { useAtom } from "jotai";
import { sidebarAtom } from "../../atoms/Atom";

function Sidebar() {
  const [isSidebarVisible] = useAtom(sidebarAtom);
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "bg-blue-600/[.1] text-blue-600" : "");

  return (
    <div className={`flex ${isSidebarVisible ? "md:w-48 w-44" : "w-0"} transition-width duration-300 ease-in-out fixed md:relative overflow-hidden h-screen shadow`}>
      <div className=" bg-white-50  p-4 w-full">
        <div className="">
          <div className="flex items-center h-max gap-2">
            <img src="/asset/stars.png" alt="" className="w-[40px] h-[40px]" />
            <h1 className="md:text-2xl font-bold mb-2">Zendenta</h1>
          </div>
          <div className="bg-white p-2 rounded-lg my-4">
            <h2 className="text-sm md:text-md font-semibold text-nowrap">Teman Ternak</h2>
            <p className="text-xs text-gray-500 md:text-sm text-nowrap">Doctor App</p>
          </div>
        </div>
        <SidebarItem icon={<MdDashboard />} label="Dashboard" className="mb-4" classActive={isActive("/dashboard")} />

        <SidebarGroup title="CLINIC">
          <SidebarItem icon={<FaCalendarAlt />} label="Reservations" />
          <SidebarItem icon={<FaUser />} label="Patients" />
          <SidebarItem icon={<FaPills />} label="Treatments" />
          <SidebarItem icon={<FaUsers />} label="Staff List" />
        </SidebarGroup>

        <SidebarGroup title="FINANCE">
          <SidebarItem icon={<FaBriefcase />} label="Accounts" />
          <SidebarItem icon={<FaChartBar />} label="Sales" />
          <SidebarItem icon={<FaShoppingCart />} label="Purchases" />
          <SidebarItem icon={<FaCreditCard />} label="Payment Method" />
        </SidebarGroup>

        <SidebarGroup title="PHYSICAL ASSET">
          <SidebarItem icon={<FaBox />} label="Stocks" />
          <SidebarItem icon={<FaDesktop />} label="Peripherals" />
        </SidebarGroup>

        <SidebarItem icon={<FaFileAlt />} label="Report" />
        <SidebarItem icon={<FaComments />} label="Customer Support" />
      </div>
    </div>
  );
}

export default Sidebar;
