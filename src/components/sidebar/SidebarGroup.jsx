import React from 'react';

function SidebarGroup({ title, children }) {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 text-nowrap">{title}</h3>
      {children}
    </div>
  );
}

export default SidebarGroup;
