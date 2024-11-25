import React from "react";
import { useAtom } from "jotai";
import { dataIdModalRiwayat, filterDataRiwatAtom, lengthOfHistoryAtom, modalRiwayatAtom } from "../../atoms/Atom";
import DataTable from "react-data-table-component";
import { FaEdit, FaInfoCircle } from "react-icons/fa";
import { IoStarSharp } from "react-icons/io5";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css"; // Pastikan untuk mengimpor CSS React Tooltip
import { Link } from "react-router-dom";

const TabelRiwayat = () => {
  const [filterData, setFilterData] = useAtom(filterDataRiwatAtom);
  const [lengthHistory, setLengthHistory] = useAtom(lengthOfHistoryAtom);
  const [isModalOpen, setModalOpen] = useAtom(modalRiwayatAtom);
  const [idRiwayat, setIdRiwayat] = useAtom(dataIdModalRiwayat);

  const formatDateTimeRange = (startTimeISO, endTimeISO) => {
    const startDate = new Date(startTimeISO);
    const endDate = new Date(endTimeISO);
    const dateOptions = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: false };

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

  const getReportLink = (link) => {
    return `https://api.temanternak.h14.my.id/${link.replace(/\\/g, "")}`;
  }

  const columnsKonsultasi = [
    {
      name: "Nama Pemesan",
      selector: (row) => row.bookerName,
      sortable: true,
      cell: (row) => (
        <div>
          <span className="font-semibold text-gray-800">{row.bookerName}</span>
          
        </div>
      ),
      width: "20%",
    },
    {
      name: "Waktu Pelaksanaan",
      selector: (row) => row.startTime,
      sortable: true,
      cell: (row) => (
        <span className="font-semibold text-gray-800">
          {formatDateTimeRange(row.startTime, row.endTime)}
        </span>
      ),
      width: "20%",
    },
    {
      name: "Jenis Konsultasi",
      selector: (row) => row.serviceName,
      sortable: true,
      cell: (row) => (
        <span className="font-semibold text-gray-800">{row.serviceName}</span>
      ),
      width: "20%",
    },
    {
      name: "Rating",
      selector: (row) => row.review?.stars || "-",
      sortable: true,
      cell: (row) => (
        <div className="font-semibold text-gray-800 flex items-center gap-1">
          {row.review?.stars ? (
            <>
              <p>{row.review.stars}</p>
              <IoStarSharp className="text-yellow-500 text-lg mb-1" />
            </>
          ) : (
            "-"
          )}
        </div>
      ),
      width: "10%",
    },
    
    {
      name: "Review",
      selector: (row) => row.review?.review || "-",
      sortable: false,
      cell: (row) => (
        row.review ? (
          <p
            className="text-xs underline cursor-pointer"
            data-tooltip-id="review-tooltip"
            data-tooltip-content={row.review.review || "Tidak ada review."}
          >
            Lihat Review
          </p>
        ) : (
          <span className="text-xs text-gray-500">Tidak ada review</span>
        )
      ),
      width: "10%",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span className={`font-semibold ${getStatusStyle(row.status)} px-2 py-1 rounded`}>
          {row.status}
        </span>
      ),
      width: "10%",
    },
    {
      name: "Laporan",
      cell: (row) =>
        row.reportFilePath ? (
          <Link to={getReportLink(row.reportFilePath)} target="_Blank" className="underline">
          Lihat Laporan
          </Link>
        ) : (
          <p>Tidak Ada Laporan</p>
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
      <DataTable
        columns={columnsKonsultasi}
        data={filterData}
        customStyles={customStyles}
        pagination
        highlightOnHover
        pointerOnHover
        noDataComponent={
          lengthHistory === null ? (
            <div className="py-4 text-center text-gray-500">Memuat data</div>
          ) : filterData.length === 0 ? (
            <div className="py-4 text-center text-gray-500">Tidak ada data yang cocok dengan pencarian Anda</div>
          ) : (
            ""
          )
        }
      />
      <ReactTooltip id="review-tooltip" place="bottom" style={{ fontSize: "12px" }}/>
    </div>
  );
};

export default TabelRiwayat;
