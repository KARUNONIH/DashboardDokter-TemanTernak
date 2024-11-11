import React from "react";
import { useAtom } from "jotai";
import { modalKonsultasiAtom, activeFeatureAtom } from "../../atoms/Atom";
import { GoDotFill } from "react-icons/go";
import GeneralData from "./GeneralData";
import { LuClock3 } from "react-icons/lu";
import { Link } from "react-router-dom";
import { PiHandWithdraw } from "react-icons/pi";

const Modal = () => {
  const [isModalOpen, setModalOpen] = useAtom(modalKonsultasiAtom);
  if (!isModalOpen) return null;

  const handleOverlayClick = () => {
    setModalOpen(false);
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-5" onClick={handleOverlayClick}>
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg" onClick={handleModalContentClick}>
        <div className="flex justify-between items-center">
          <div className="">
            <p className="text-sm text-gray-500">
              Reservation ID <span className="text-base text-black font-medium">#RSVA001</span>
            </p>
          </div>
          <button className=" text-3xl" onClick={() => setModalOpen(false)}>
            &times;
          </button>
        </div>
        <div className="flex justify-between items-center border-gray-300 border-2 p-2 rounded mt-2">
          <section className="flex items-center gap-4">
            <img src="" alt="" className="bg-blue-600 rounded-full h-10 aspect-square" />
            <div className="">
              <p className="text-xs text-gray-600">Nama Pasien</p>
              <h1 className="text-base font-semibold">Muhammad Gibran Angalana</h1>
            </div>
          </section>
          <section className="flex gap-4 items-center">
            <p className="text-xs text-gray-600">Status Konsultasi</p>
            <div className="flex items-center gap-1 border-2 border-gray-300 py-1 px-2 rounded">
              <div className="text-green-600">
              <GoDotFill />
              </div>
              <p className="text-sm font-medium">Upcoming</p>
            </div>
          </section>
        </div>
        <div className="flex justify-between py-6">
          <GeneralData logo={<LuClock3 />} label={"Tipe Konsultasi"} data={ "Video call" } />
          <GeneralData logo={<LuClock3 />} label={"Tanggal dan Waktu"} data={ "Fri, 16 May" } time={"02:00-03:00 PM"}/>
          <GeneralData logo={<LuClock3 />} label={"Durasi"} data={ "120 Menit" } />
        </div>
        <div className="border-y-2 border-gray-300 py-3 flex items-center justify-between">
          <p className="text-sm text-gray-600">Biaya Konsultasi: <span className="text-black font-medium">Rp 90.000</span></p>
          <Link to={'/keuangan'} className="flex items-center text-xs gap-2 border-2 border-gray-300 py-1 px-2 rounded hover:">
            <div className="text-yellow-600"><PiHandWithdraw /></div>
            Keuangan
          </Link>
        </div>
        {/* content */}
      </div>
    </div>
  );
};

export default Modal;
