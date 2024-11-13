import React from "react";
import { FaChevronDown, FaDownload, FaEdit } from "react-icons/fa";

const DataTable = ({ key, name, duration, price, description, status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-purple-100 text-purple-700";
      case "Suspend":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formattedPrice = price.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-3 font-semibold text-gray-800">{name}</td>
      <td className="px-4 py-3 text-gray-600">{duration} Menit</td>
      <td className="px-4 py-3 text-gray-600">{formattedPrice}</td>
      <td className="px-4 py-3 font-semibold text-gray-600">{description}</td>
      <td className="px-4 py-3">
        <span className={`rounded-md px-2 py-1 text-xs font-medium ${getStatusStyle()}`}>{status}</span>
      </td>
      <td className="flex space-x-2 px-4 py-3">
        {status === "Accepted" && (
          <div className="flex">
            <FaEdit className="cursor-pointer text-gray-500 hover:text-gray-700" />
            <FaDownload className="cursor-pointer text-gray-500 hover:text-gray-700" />
            <FaChevronDown className="cursor-pointer text-gray-500 hover:text-gray-700" />
          </div>
        )}
      </td>
    </tr>
  );
};

export default DataTable;
