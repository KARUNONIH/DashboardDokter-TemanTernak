import React from "react";
import DataRiwayat from "./DataRiwayat";
import { FaMoneyBillWave } from "react-icons/fa";

const DashboardHeader = () => {
  return (
    <div className="my-10 flex gap-10 items-center ">
      <DataRiwayat logo={<FaMoneyBillWave />} label={"Total Pasien Bulan Ini"} number={900} data={"+90%"} />
      <div className="my-1 w-[2px] bg-slate-300 h-[50px]"></div>
      <DataRiwayat logo={<FaMoneyBillWave />} label={"Total Pasien Bulan Ini"} number={900} data={"+90%"} />

      
    </div>
  );
};

export default DashboardHeader;
