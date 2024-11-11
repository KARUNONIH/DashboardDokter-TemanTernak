import React from "react";
import PaymentRow from "./PaymentRow";

const paymentsData = [
  {
    reservationId: "#RSV008",
    patientName: "Albert Flores",
    patientImage: "/path/to/image.jpg",
    billNumber: "1/2",
    reservationDate: "24/05/2022",
    totalAmount: "$2,311",
    paymentStatus: "Partially Paid",
  },
  {
    reservationId: "#RSV007",
    patientName: "Esther Howard",
    patientImage: "/path/to/image2.jpg",
    billNumber: "0/2",
    reservationDate: "23/05/2022",
    totalAmount: "$535",
    paymentStatus: "Unpaid",
  },
  // Tambahkan data lainnya di sini
];

const TabelRiwayat = () => {
  return (
    <div className="bg-white rounded-lg shadow shadow-gray-300 p-6">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-100 rounded ">
            <th className="px-4 py-2 text-left text-gray-600 font-medium">Reservation ID</th>
            <th className="px-4 py-2 text-left text-gray-600 font-medium">Patient Name</th>
            <th className="px-4 py-2 text-left text-gray-600 font-medium">Number of Bill</th>
            <th className="px-4 py-2 text-left text-gray-600 font-medium">Reservation Date</th>
            <th className="px-4 py-2 text-left text-gray-600 font-medium">Total Amount</th>
            <th className="px-4 py-2 text-left text-gray-600 font-medium">Payment Status</th>
            <th className="px-4 py-2 text-left text-gray-600 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paymentsData.map((payment, index) => (
            <PaymentRow
              key={index}
              reservationId={payment.reservationId}
              patientName={payment.patientName}
              patientImage={payment.patientImage}
              billNumber={payment.billNumber}
              reservationDate={payment.reservationDate}
              totalAmount={payment.totalAmount}
              paymentStatus={payment.paymentStatus}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabelRiwayat;
