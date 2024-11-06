import React from "react";
import { Link } from "react-router-dom";

function SidebarItem({ icon, label, className, classActive, path }) {
  return (
    <Link to={path}>
      <div className={`md:text-md flex cursor-pointer items-center gap-2 rounded-lg p-1.5 text-sm hover:bg-gray-200 ${className} ${classActive}`}>
        <div className="text-gray-500">{icon}</div>
        <span className="text-nowrap font-semibold">{label}</span>
      </div>
    </Link>
  );
}

export default SidebarItem;
