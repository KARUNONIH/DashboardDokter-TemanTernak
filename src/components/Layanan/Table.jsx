import { useAtom } from "jotai";
import { settingMenuLayananAtom, modalLayananAtom, editServiceDataAtom, typeModalLayananAtom, editServiceDataNoIdAtom, filterDataLayananKonsultasiJadwalAtom, lengthOfConsultationAtom } from "../../atoms/Atom";
import DataTable from "react-data-table-component";
import React from "react";
import { FaChevronDown, FaDownload, FaEdit } from "react-icons/fa";
import { FaLocationArrow } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Table = () => {
  const [settingMenuLayanan] = useAtom(settingMenuLayananAtom);
  const [filterData] = useAtom(filterDataLayananKonsultasiJadwalAtom);
  const [isModalOpen, setModalOpen] = useAtom(modalLayananAtom);
  const [editdataService, setEditDataService] = useAtom(editServiceDataAtom);
  const [editdataServiceNoId, setEditDataServiceNoId] = useAtom(editServiceDataNoIdAtom);
  const [typeModal, setTypeModal] = useAtom(typeModalLayananAtom);
  const [lengthOfConsultations, setLengthOfConsultations] = useAtom(lengthOfConsultationAtom);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    return new Intl.DateTimeFormat("id-ID", options).format(date);
  };

  const formatISOToDate = (isoString) => {
    const date = new Date(isoString);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  };

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

  const columnsLayanan = [
    {
      name: "Nama Layanan",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => <span className="font-semibold text-gray-800">{row.name}</span>,
      width: "20%",
    },
    {
      name: "Durasi",
      selector: (row) => row.duration,
      sortable: true,
      cell: (row) => <span className="text-gray-600">{row.duration} Menit</span>,
      width: "10%",
    },
    {
      name: "Biaya",
      selector: (row) => row.price,
      sortable: true,
      cell: (row) => <span className="text-gray-600">{row.price.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</span>,
      width: "10%",
    },
    {
      name: "Deskripsi",
      cell: (row) => <span className="text-gray-600">{row.description}</span>,
      width: "40%",
    },
    {
      name: "Status",
      selector: (row) => row.isAccepted && !row.isSuspended ? "approved" : !row.isAccepted && !row.isSuspended ? "pending" : "suspended",
      sortable:true,
      cell: (row) => <span className={`rounded-md px-2 py-1 text-xs font-medium ${row.isAccepted && !row.isSuspended ? getStatusStyle("approved") : !row.isAccepted && !row.isSuspended ? getStatusStyle("pending") : getStatusStyle("suspend")}`}>{row.isAccepted && !row.isSuspended ? "Approved" : !row.isAccepted && !row.isSuspended ? "Pending" : "Suspended"}</span>,
      width: "10%",
    },
    {
      name: "Aksi",
      sortable: true,
      cell: (row) => (
        row.isAccepted && !row.isSuspended ?
        <div
          className="flex aspect-square h-10 items-center justify-center rounded border-2 border-yellow-400 text-black hover:bg-yellow-400 hover:text-white"
          onClick={() => {
            setEditDataServiceNoId({ price: row.price, duration: row.duration, description: row.description, name: row.name });
            setEditDataService({ id: row.id, price: row.price, duration: row.duration, description: row.description, name: row.name });
            setTypeModal("edit");
            setModalOpen(true);
          }}
        >
          <FaEdit className="cursor-pointer text-xl" />
          </div>
          :
          <p>No Action</p>
      ),
      width: "10%",
    },
  ];
  
  const columnsJadwal = [
    {
      name: "Waktu Mulai",
      selector: (row) => row.startTime,
      sortable: true,
      cell: (row) => <span className="font-semibold text-gray-800">{formatDateTime(row.startTime)} </span>,
      width: "30%",
    },
    {
      name: "Waktu Berakhir",
      selector: (row) => row.endTime,
      sortable: true,
      cell: (row) => <span className="font-semibold text-gray-800">{formatDateTime(row.endTime)} </span>,
      width: "30%",
    },
    {
      name: "Aksi",
      cell: (row) => (
        <Link
          to={`/konsultasi?tanggal=${formatISOToDate(row.startTime)}`}
          className="flex aspect-square h-10 items-center justify-center rounded border-2 border-yellow-400 text-black hover:bg-yellow-400 hover:text-white"
          onClick={() => {
            setEditDataServiceNoId({ price: row.price, duration: row.duration, description: row.description, name: row.name });
            setEditDataService({ id: row.id, price: row.price, duration: row.duration, description: row.description, name: row.name });
            setTypeModal("edit");
            setModalOpen(true);
          }}
        >
          <FaInfoCircle className="cursor-pointer text-xl" />
        </Link>
      ),
      width: "40%",
    },
  ];

  const columnsKonsultasi = [
    {
      name: "Nama Pemesan",
      selector: (row) => row.booker.name,
      sortable: true,
      cell: (row) => <span className="font-semibold text-gray-800">{ row.booker.name }</span>,
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
      selector: (row) => row.service.name,
      sortable: true,
      cell: (row) => <span className="font-semibold text-gray-800">{row.service.name}</span>,
      width: "30%",
    },
    {
      name: "Durasi",
      selector: (row) => row.service.duration,
      sortable: true,
      cell: (row) => <span className="font-semibold text-gray-800">{row.service.duration} Menit</span>,
      width: "15%",
    },
    // {
    //   name: "Biaya",
    //   selector: (row) => row.price,
    //   sortable: true,
    //   cell: (row) => <span className="font-semibold text-gray-800">{row.service.price.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</span>,
    //   width: "15%",
    // },
    {
      name: "Aksi",
      cell: (row) => (
        <a href={`https://room-teman-ternak.netlify.app/?id=${row.id}&token=${JSON.parse(localStorage.getItem("token"))}`}
          className="flex aspect-square h-10 items-center justify-center rounded border-2 border-yellow-400 text-black hover:bg-yellow-400 hover:text-white"
        target="_Blank">
          <FaInfoCircle className="cursor-pointer text-xl" />
        </a>
      ),
      width: "10%",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-orange-100 text-orange-700";
      case "suspend":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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
    <>
      {settingMenuLayanan.activeMenu === "layanan" && (
        <div className="mt-10 rounded-lg bg-white p-6 shadow shadow-gray-300">
          <DataTable columns={columnsLayanan} data={filterData.layanan} customStyles={customStyles} pagination highlightOnHover pointerOnHover noDataComponent={lengthOfConsultations.layanan === null ? <div className="py-4 text-center text-gray-500">Memuat data</div> : filterData.layanan.length === 0 ? <div className="py-4 text-center text-gray-500">Tidak ada data</div> : ""}  />
        </div>
      )}
      {settingMenuLayanan.activeMenu === "jadwal" && (
        <div className="mt-10 rounded-lg bg-white p-6 shadow shadow-gray-300">
          <DataTable columns={columnsJadwal} data={filterData.jadwal} customStyles={customStyles} pagination highlightOnHover pointerOnHover noDataComponent={lengthOfConsultations.jadwal === null ? <div className="py-4 text-center text-gray-500">Memuat data</div> : filterData.jadwal.length === 0 ? <div className="py-4 text-center text-gray-500">Tidak ada data</div> : ""}  />
        </div>
      )}
      {settingMenuLayanan.activeMenu === "konsultasi" && (
        <div className="mt-10 rounded-lg bg-white p-6 shadow shadow-gray-300">
          <DataTable columns={columnsKonsultasi} data={filterData.konsultasi} customStyles={customStyles} pagination highlightOnHover pointerOnHover noDataComponent={lengthOfConsultations.konsultasi === null ? <div className="py-4 text-center text-gray-500">Memuat data</div> : filterData.konsultasi.length === 0 ? <div className="py-4 text-center text-gray-500">Tidak ada data</div> : ""} />
        </div>
      )}
    </>
  );
};

export default Table;
