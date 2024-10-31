import React from 'react';

function SidebarItem({ icon, label, className, classActive }) {
  return (
    <div className={`flex items-center gap-2 p-1.5 hover:bg-gray-200 rounded-lg cursor-pointer md:text-md text-sm ${className} ${classActive}`}>
      <div className="text-gray-500">
        {icon}
      </div>
      <span className='font-semibold text-nowrap'>{label}</span>
    </div>
  );
}

export default SidebarItem;
