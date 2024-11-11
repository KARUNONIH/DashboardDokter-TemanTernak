import React from "react";
import { FaChevronDown, FaDownload, FaEdit } from "react-icons/fa";

const PaymentRow = ({
  reservationId,
  patientName,
  patientImage,
  billNumber,
  reservationDate,
  totalAmount,
  paymentStatus,
}) => {
  const getStatusStyle = () => {
    switch (paymentStatus) {
      case "Fully Paid":
        return "bg-green-100 text-green-700";
      case "Partially Paid":
        return "bg-purple-100 text-purple-700";
      case "Unpaid":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      {/* Reservation ID */}
      <td className="px-4 py-3 text-gray-800 font-semibold">{reservationId}</td>

      {/* Patient Name */}
      <td className="px-4 py-3 flex items-center">
        <img
          src={patientImage}
          alt={`${patientName} profile`}
          className="w-8 h-8 rounded-full mr-2"
        />
        <span className="text-gray-800">{patientName}</span>
      </td>

      {/* Number of Bill */}
      <td className="px-4 py-3 text-gray-600">{billNumber}</td>

      {/* Reservation Date */}
      <td className="px-4 py-3 text-gray-600">{reservationDate}</td>

      {/* Total Amount */}
      <td className="px-4 py-3 font-semibold text-gray-800">{totalAmount}</td>

      {/* Payment Status */}
      <td className="px-4 py-3">
        <span className={`text-xs font-medium px-2 py-1 rounded-md ${getStatusStyle()}`}>
          {paymentStatus}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3 flex space-x-2">
        <FaEdit className="text-gray-500 cursor-pointer hover:text-gray-700" />
        <FaDownload className="text-gray-500 cursor-pointer hover:text-gray-700" />
        <FaChevronDown className="text-gray-500 cursor-pointer hover:text-gray-700" />
      </td>
    </tr>
  );
};

export default PaymentRow;
