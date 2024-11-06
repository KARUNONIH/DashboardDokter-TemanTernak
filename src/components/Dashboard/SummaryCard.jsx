import React from "react";

function SummaryCard({ title, value, color }) {
  const backgroundColor = {
    wrapper: {
      blue: "bg-gradient-to-br from-blue-900 to-blue-600",
      purple: "bg-gradient-to-br from-purple-900 to-purple-600",
      green: "bg-gradient-to-br from-green-900 to-green-600",
    },
    shade: {
      blue: "bg-blue-800",
      purple: "bg-purple-800",
      green: "bg-green-800",
    },
  };

  const dropshadow = "0px 0px 10px rgba(255, 255, 255,  0.2)";

  return (
    <div className={`${backgroundColor.wrapper[color]} relative overflow-hidden rounded p-6 text-white shadow shadow-gray-300`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      <div className={`absolute aspect-square ${backgroundColor.shade[color]} -right-10 top-0 rotate-[45deg]`} style={{ height: "calc(100%)", filter: `drop-shadow(${dropshadow})` }}></div>
    </div>
  );
}

export default SummaryCard;
