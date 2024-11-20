import React from "react";
import { useAtom } from "jotai";
import { filterDataRiwatAtom, lengthOfHistoryAtom } from "../../atoms/Atom";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";



const TabelRiwayat = () => {
  const [filterData, setFilterData] = useAtom(filterDataRiwatAtom);
  const [lengthHistory, setLengthHistory] = useAtom(lengthOfHistoryAtom);

  const formatDateTimeRange = (startTimeISO, endTimeISO) => {
    const startDate = new Date(startTimeISO);
    const endDate = new Date(endTimeISO);
    
    const dateOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const formattedDate = new Intl.DateTimeFormat("id-ID", dateOptions).format(startDate);
    const formattedStartTime = new Intl.DateTimeFormat("id-ID", timeOptions).format(startDate);
    const formattedEndTime = new Intl.DateTimeFormat("id-ID", timeOptions).format(endDate);
    return `${formattedDate} ${formattedStartTime} - ${formattedEndTime}`;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "FAILED":
        return "bg-red-100 text-red-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  const columnsKonsultasi = [
    {
      name: "Nama Pemesan",
      selector: (row) => row.bookerName,
      sortable: true,
      cell: (row) => <span className="font-semibold text-gray-800">{row.bookerName}</span>,
      width: "20%",
    },
    {
      name: "Waktu Pelaksanaan",
      selector: (row) => row.startTime,
      sortable: true,
      cell: (row) => <span className="font-semibold text-gray-800">{formatDateTimeRange(row.startTime, row.endTime)}</span>,
      width: "25%",
    },
    {
      name: "Jenis Konsultasi",
      selector: (row) => row.serviceName,
      sortable: true,
      cell: (row) => <span className="font-semibold text-gray-800">{row.serviceName}</span>,
      width: "20%",
    },
    {
      name: "Durasi",
      selector: (row) => row.duration,
      sortable: true,
      cell: (row) => <span className="font-semibold text-gray-800">{row.duration} Menit</span>,
      width: "10%",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => <span className={`font-semibold ${getStatusStyle(row.status)} px-2 py-1 rounded`}>{row.status}</span>,
      width: "15%",
    },
    {
      name: "Aksi",
      cell: (row) => (
        <Link to={`/layanan?id=${row.id}&token=${JSON.parse(localStorage.getItem("token"))}`} className="flex aspect-square h-10 items-center justify-center rounded border-2 border-yellow-400 text-black hover:bg-yellow-400 hover:text-white">
          <FaInfoCircle className="cursor-pointer text-xl" />
        </Link>
      ),
      width: "10%",
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: "56px",
      },
    },
    headCells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
        fontWeight: "600",
        fontSize: "14px",
        backgroundColor: "#f3f4f6",
        color: "#4b5563",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
  };
  return (
    <div className="mt-10 rounded-lg bg-white p-6 shadow shadow-gray-300">
      <DataTable columns={columnsKonsultasi} data={filterData} customStyles={customStyles} pagination highlightOnHover pointerOnHover noDataComponent={lengthHistory === null ? <div className="py-4 text-center text-gray-500">Memuat data</div> : filterData.length === 0 ? <div className="py-4 text-center text-gray-500">Tidak ada data yang cocok dengan pencarian Anda</div> : ""} />
    </div>
  );
};

export default TabelRiwayat;
