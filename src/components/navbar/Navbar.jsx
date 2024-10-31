import React from "react";

import ProfileDropdown from "./ProfileDropdown";
import { useLocation } from "react-router-dom";
import ButtonToggleSidebar from "./ButtonToggleSidebar";
import NavbarContent from "./NavbarContent";

const Navbar = () => {
  const location = useLocation();
  const pageTitles = {
    '/dashboard': 'Dashboard',
  }
  const pageTitle = pageTitles[location.pathname];

  return (
    <nav className="flex items-center justify-between px-4 py-0 bg-white border-b">
      <div className="flex items-center gap-2">
        <ButtonToggleSidebar className={ "hidden md:block "} />
        <h1 className="text-xl font-bold">{pageTitle}</h1>
      </div>
      <NavbarContent/>
    </nav>
  );
};

export default Navbar;
