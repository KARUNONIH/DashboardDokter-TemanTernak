import React from "react";
import RecentPatient from "./RecentPatient";
import { useAtom } from "jotai";
import { recentPatientAtom } from "../../atoms/Atom";
import ButtonChangeRecentPatient from "./ButtonChangeRecentPatient";
import { FaVideo } from "react-icons/fa6";


function KonsultasiTerkini() {
  const [recentPatient, setRecentPatient] = useAtom(recentPatientAtom);

  const changeRecentPatient = (type) => {
    setRecentPatient(type);
  };

  return (
    <div className="flex-1 rounded bg-white p-6 shadow shadow-gray-300">
      <h2 className="mb-4 text-base font-semibold">Konsultasi Pasien Terkini</h2>
      <div className="space-y-2 text-gray-600">
        <div className="flex gap-1 rounded border-2 border-gray-300 bg-gray-100 p-1 shadow">
          <ButtonChangeRecentPatient label='upcoming' onClick={() => changeRecentPatient("upcoming")}/>
          <ButtonChangeRecentPatient label='done' onClick={() => changeRecentPatient("done")}/>
        </div>
      </div>
      {recentPatient === "upcoming" ? (
        <div className="">
          <RecentPatient logo={<FaVideo/>} nama={'Hasan Ismasil Abdulmalik'} tanggal={'15 Agustus 2024'} jam={'14:00 WIB'}/>
          <RecentPatient logo={<FaVideo/>} nama={'Hasan Ismasil Abdulmalik'} tanggal={'15 Agustus 2024'} jam={'14:00 WIB'}/>
          <RecentPatient logo={<FaVideo/>} nama={'Hasan Ismasil Abdulmalik'} tanggal={'15 Agustus 2024'} jam={'14:00 WIB'}/>
          <RecentPatient logo={<FaVideo/>} nama={'Hasan Ismasil Abdulmalik'} tanggal={'15 Agustus 2024'} jam={'14:00 WIB'}/>
        </div>
      ) : (
          <div className="">
          <RecentPatient logo={<FaVideo/>} nama={'Zacky Fachri Hadafi'} tanggal={'15 Agustus 2024'} jam={'14:00 WIB'} status={'done'}/>
        </div>
      )}
    </div>
  );
}

export default KonsultasiTerkini;
