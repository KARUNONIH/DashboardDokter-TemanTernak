import React from "react";
import BarChart from "./BarChart";
import DataDashboard from "./DataDashboard";
import { IoStarSharp } from "react-icons/io5";
import { FaMoneyBillWave } from "react-icons/fa";
import { MdMedicalServices } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { useAtom } from "jotai";
import { dataDashboardAtom } from "../../atoms/Atom";

function StatisktikKonsultasi() {

  const [DataDashboardInfo, setDataDashboardInfo] = useAtom(dataDashboardAtom);

  return (
    <div className="bg-white p-6 rounded shadow shadow-gray-300 w-[65%] grid grid-cols-2 gap-4">
      <DataDashboard title={"Rata-rata rating"} logo={<IoStarSharp />} data={DataDashboardInfo.averageRating} explanation={`Rata-rata rating konsultasi anda yang telah anda lakukan adalah ${DataDashboardInfo.averageRating} bintang`}/>
      <DataDashboard title={"Total Pendapatan"} logo={<FaMoneyBillWave />} data={ DataDashboardInfo.totalTransactionsAmount?.toLocaleString("id-ID", { style: "currency", currency: "IDR" })} explanation={"Total Pendapatan anda selama anda melakukan komsultasi yaitu sebesar Rp 200.000,00"} />
      <DataDashboard title={"Layanan Tersedia"} logo={<MdMedicalServices />} data={DataDashboardInfo.approvedService} explanation={`Anda memiliki total ${DataDashboardInfo.approvedService} layanan yang telah disetujui oleh admin`}/>
      <DataDashboard title={"Jadwal Mendatang"} logo={<FaCalendarAlt />} data={ DataDashboardInfo.futureSchedule } explanation={`Anda memiliki ${DataDashboardInfo.futureSchedule } jadwal di kemudian hari, pastikan anda mengosongkan jadwal pada hari itu`} />
    </div>
  );
}

export default StatisktikKonsultasi;
