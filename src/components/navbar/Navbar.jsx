import React from "react";

import ProfileDropdown from "./ProfileDropdown";
import { useLocation } from "react-router-dom";
import ButtonToggleSidebar from "./ButtonToggleSidebar";
import NavbarContent from "./NavbarContent";

const Navbar = () => {
  const location = useLocation();
  const pageTitles = {
    '/dashboard': 'Dashboard',
    '/layanan': 'layanan',
    '/konsultasi': 'konsultasi',
    '/riwayat': 'riwayat',
    '/keuangan': 'keuangan',
    '/pengaturan': 'pengaturan',
  }
  const pageTitle = pageTitles[location.pathname];

  return (
    <nav className="flex items-center justify-between px-4 py-0 bg-white border-b sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <ButtonToggleSidebar className={ "hidden md:block "} />
        <h1 className="text-xl font-bold  capitalize">{pageTitle}</h1>
      </div>
      <NavbarContent/>
    </nav>
  );
};

export default Navbar;
