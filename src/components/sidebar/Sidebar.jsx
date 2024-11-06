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
    <div className={`flex ${isSidebarVisible ? "md:w-48 w-44" : "w-0"} transition-width duration-300 ease-in-out fixed bg-white z-50 overflow-hidden h-screen shadow`}>
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
        <SidebarItem icon={<MdDashboard />} label="Dashboard" className="mb-4" classActive={isActive("/dashboard")} path={'/dashboard'}/>

        <SidebarGroup title="SERVICE">
          <SidebarItem icon={<FaPills />} label="Layanan" classActive={isActive("/layanan")} path={'/layanan'}/>
          <SidebarItem icon={<FaCalendarAlt />} label="Konsultasi" classActive={isActive("/konsultasi")} path={'/konsultasi'}/>
          <SidebarItem icon={<FaUser />} label="Riwayat" classActive={isActive("/riwayat")} path={'/riwayat'}/>
        </SidebarGroup>

        <SidebarGroup title="FINANCE">
          <SidebarItem icon={<FaBriefcase />} label="Keuangan" classActive={isActive("/keuangan")} path={'/keuangan'}/>
        </SidebarGroup>

        <SidebarItem icon={<FaComments />} label="setting"classActive={isActive("/pengaturan")} path={'/pengaturan'}/>
      </div>
    </div>
  );
}

export default Sidebar;
