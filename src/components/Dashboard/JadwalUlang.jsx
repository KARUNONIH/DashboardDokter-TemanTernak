import React from "react";
import ReschedulePatient from "./ReschedulePatient";
import { FaVideo } from "react-icons/fa6";


function JadwalUlang() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-base font-semibold mb-4">Pasien Jadwal Ulang</h2>
      <div className="">
        <ReschedulePatient nama={'Rintan Arufafa Aji'} tanggalLama={'20 Agustus 2024'} tanggalBaru={'31 Agustus 2024'} jamLama={'20:00 WIB'} jamBaru={'20:00 WIB'} logo={<FaVideo/>} />
        <ReschedulePatient nama={'Rintan Arufafa Aji'} tanggalLama={'20 Agustus 2024'} tanggalBaru={'31 Agustus 2024'} jamLama={'20:00 WIB'} jamBaru={'20:00 WIB'} logo={<FaVideo/>} />
        <ReschedulePatient nama={'Rintan Arufafa Aji'} tanggalLama={'20 Agustus 2024'} tanggalBaru={'31 Agustus 2024'} jamLama={'20:00 WIB'} jamBaru={'20:00 WIB'} logo={<FaVideo/>} />
      </div>
    </div>
  );
}

export default JadwalUlang;
