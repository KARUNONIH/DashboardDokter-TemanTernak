import React from "react";
import RecentPatient from "./RecentPatient";
import { useAtom } from "jotai";
import { konsultasiTerkiniAtom, recentPatientAtom } from "../../atoms/Atom";
import ButtonChangeRecentPatient from "./ButtonChangeRecentPatient";
import { FaVideo } from "react-icons/fa6";

function RecentConsultation() {
  const [recentPatient, setRecentPatient] = useAtom(recentPatientAtom);
  const [KonsultasiTerkini, setKonsultasiTerkini] = useAtom(konsultasiTerkiniAtom);

  const changeRecentPatient = (type) => {
    setRecentPatient(type);
  };

  const konversiTanggalDanWaktu = (datetime, type) => {
    const date = new Date(datetime);

    const tanggalOptions = { day: "numeric", month: "long", year: "numeric" };
    const tanggal = date.toLocaleDateString("id-ID", tanggalOptions);

    const waktuOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
    const waktu = `${date.toLocaleTimeString("id-ID", waktuOptions)} WIB`;

    if (type === "tanggal") return tanggal;
    if (type === "waktu") return waktu;
  };

  return (
    <div className="flex-1 rounded bg-white p-6 shadow shadow-gray-300">
      <h2 className="mb-4 text-base font-semibold">Konsultasi Pasien Terkini</h2>
      <div className="space-y-2 text-gray-600">
        <div className="flex gap-1 rounded border-2 border-gray-300 bg-gray-100 p-1 shadow">
          <ButtonChangeRecentPatient label="upcoming" onClick={() => changeRecentPatient("upcoming")} />
          <ButtonChangeRecentPatient label="done" onClick={() => changeRecentPatient("done")} />
        </div>
      </div>
      {recentPatient === "upcoming" ? (
        <div>{KonsultasiTerkini.upcoming && KonsultasiTerkini.upcoming.length > 0 ? KonsultasiTerkini.upcoming.slice(0, 4).map((item, index) => <RecentPatient key={index} logo={`https://ui-avatars.com/api/?name=${item.bookerName}&background=0D8ABC&color=fff`} nama={item.bookerName} tanggal={konversiTanggalDanWaktu(item.startTime, "tanggal")} jam={konversiTanggalDanWaktu(item.startTime, "waktu")} />) : <p className="text-center">Belum ada konsultasi yang dijadwalkan.</p>}</div>
      ) : (
        <div className="">
          <div>{KonsultasiTerkini.done && KonsultasiTerkini.done.length > 0 ? KonsultasiTerkini.done.slice(0, 4).map((item, index) => <RecentPatient key={index} logo={`https://ui-avatars.com/api/?name=${item.bookerName}&background=0D8ABC&color=fff`} nama={item.bookerName} tanggal={konversiTanggalDanWaktu(item.startTime, "tanggal")} jam={konversiTanggalDanWaktu(item.startTime, "waktu")} />) : <p className="text-center">Belum ada konsultasi yang dijadwalkan.</p>}</div>
        </div>
      )}
    </div>
  );
}

export default RecentConsultation;
