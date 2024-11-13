import { useAtom } from "jotai";
import { settingMenuLayananAtom, modalLayananAtom, editServiceDataAtom, typeModalLayananAtom, editServiceDataNoIdAtom, filterDataLayananKonsultasiJadwalAtom } from "../../atoms/Atom";
import DataTable from "react-data-table-component";
import React from "react";
import { FaChevronDown, FaDownload, FaEdit } from "react-icons/fa";

const Table = () => {
  const [settingMenuLayanan] = useAtom(settingMenuLayananAtom);
  const [filterData] = useAtom(filterDataLayananKonsultasiJadwalAtom);
  const [isModalOpen, setModalOpen] = useAtom(modalLayananAtom);
  const [editdataService, setEditDataService] = useAtom(editServiceDataAtom);
  const [editdataServiceNoId, setEditDataServiceNoId] = useAtom(editServiceDataNoIdAtom);
  const [typeModal, setTypeModal] = useAtom(typeModalLayananAtom);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };
    
    return new Intl.DateTimeFormat('id-ID', options).format(date);
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
      selector: (row) => row.description,
      cell: (row) => <span className="text-gray-600">{row.description}</span>,
      width: "40%",
    },
    {
      name: "Status",
      cell: (row) => <span className={`rounded-md px-2 py-1 text-xs font-medium ${getStatusStyle("Accepted")}`}>Accepted</span>,
      width: "10%",
    },
    {
      name: "Aksi",
      cell: (row) => (
        <div className="flex items-center justify-center h-10 aspect-square border-2 border-yellow-400 text-black hover:bg-yellow-400 hover:text-white rounded" onClick={() => {
          setEditDataServiceNoId({ price: row.price, duration: row.duration, description: row.description, name: row.name });
          setEditDataService({ id:row.id, price: row.price, duration: row.duration, description: row.description, name: row.name });
          setTypeModal("edit");
          setModalOpen(true);
        }}>
          <FaEdit className="cursor-pointer text-xl" />
        </div>
      ),
      width: "10%",
    },
  ];
  const columnsJadwal = [
    {
      name: "Waktu Mulai",
      selector: (row) => row.start_time,
      sortable: true,
      cell: (row) => <span className="font-semibold text-gray-800">{formatDateTime(row.start_time)} </span>,
      width: "30%",
    },
    {
      name: "Waktu Berakhir",
      selector: (row) => row.end_time,
      sortable: true,
      cell: (row) => <span className="font-semibold text-gray-800">{formatDateTime(row.end_time)} </span>,
      width: "30%",
    },
    {
      name: "Aksi",
      cell: (row) => (
        <div className="flex items-center justify-center h-10 aspect-square border-2 border-yellow-400 text-black hover:bg-yellow-400 hover:text-white rounded" onClick={() => {
          setEditDataServiceNoId({ price: row.price, duration: row.duration, description: row.description, name: row.name });
          setEditDataService({ id:row.id, price: row.price, duration: row.duration, description: row.description, name: row.name });
          setTypeModal("edit");
          setModalOpen(true);
        }}>
          <FaEdit className="cursor-pointer text-xl" />
        </div>
      ),
      width: "40%",
    },
  ];

  const getStatusStyle = (status) => {
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
        <div className="mt-10 rounded-lg bg-white p-6 shadow shadow-gray-300 ">
          <DataTable
            columns={columnsLayanan}
            data={filterData.layanan}
            customStyles={customStyles}
            pagination
            highlightOnHover
            pointerOnHover
            noDataComponent={
              filterData.layanan.length === 0 ? (
                <div className="text-gray-500 text-center py-4">Tidak ada data yang cocok dengan pencarian Anda</div>
              ) : (
                <div className="text-gray-500 text-center py-4">Data tidak tersedia</div>
              )
            }
          />
        </div>
      )}
      {settingMenuLayanan.activeMenu === "jadwal" && (
        <div className="mt-10 rounded-lg bg-white p-6 shadow shadow-gray-300">
          <DataTable
            columns={columnsJadwal}
            data={filterData.jadwal}
            customStyles={customStyles}
            pagination
            highlightOnHover
            pointerOnHover
            noDataComponent={
              filterData.jadwal.length === 0 ? (
                <div className="text-gray-500 text-center py-4">Tidak ada data yang cocok dengan pencarian Anda</div>
              ) : (
                <div className="text-gray-500 text-center py-4">Data tidak tersedia</div>
              )
            }
          />
        </div>
      )}
    </>
  );
};

export default Table;
