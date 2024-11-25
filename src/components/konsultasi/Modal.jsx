import React from "react";
import { useAtom } from "jotai";
import { modalKonsultasiAtom, activeFeatureAtom, dataModalKonsultasiAtom } from "../../atoms/Atom";
import { GoDotFill } from "react-icons/go";
import GeneralData from "./GeneralData";
import { LuClock3 } from "react-icons/lu";
import { Link } from "react-router-dom";
import { PiHandWithdraw } from "react-icons/pi";

const Modal = () => {
  const [isModalOpen, setModalOpen] = useAtom(modalKonsultasiAtom);
  const [dataModal, setDataModal] = useAtom(dataModalKonsultasiAtom);

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
              Bookings ID <span className="text-base text-black font-medium">{dataModal[0].id}</span>
            </p>
          </div>
          <button className=" text-3xl" onClick={() => setModalOpen(false)}>
            &times;
          </button>
        </div>
        <div className="flex justify-between items-center border-gray-300 border-2 p-2 rounded mt-2">
          <section className="flex items-center gap-4">
            <img src={`https://ui-avatars.com/api/?name=${dataModal[0].bookerName}&background=0D8ABC&color=fff`} alt="" className="bg-blue-600 rounded-full h-10 aspect-square" />
            <div className="">
              <p className="text-xs text-gray-600">Nama Pasien</p>
              <h1 className="text-base font-semibold">{dataModal[0].bookerName}</h1>
            </div>
          </section>
          <section className="flex gap-4 items-center">
            <p className="text-xs text-gray-600">Status Konsultasi</p>
            <div className="flex items-center gap-1 border-2 border-gray-300 py-1 px-2 rounded">
              <div className="text-green-600">
              <GoDotFill />
              </div>
              <p className="text-sm font-medium">{dataModal[0].status}</p>
            </div>
          </section>
        </div>
        <div className="flex justify-between py-6">
          <GeneralData logo={<LuClock3 />} label={"Tipe Konsultasi"} data={ dataModal[0].serviceName } />
          <GeneralData logo={<LuClock3 />} label={"Tanggal dan Waktu"} data={new Date(dataModal[0].startTime).toLocaleString()} time={""}/>
          <GeneralData logo={<LuClock3 />} label={"Durasi"} data={ dataModal[0].duration + "Menit"} />
        </div>
        {/* <div className="border-y-2 border-gray-300 py-3 flex items-center justify-between">
          <p className="text-sm text-gray-600">Biaya Konsultasi: <span className="text-black font-medium">Rp 90.000</span></p>
          <Link to={'/keuangan'} className="flex items-center text-xs gap-2 border-2 border-gray-300 py-1 px-2 rounded hover:">
            <div className="text-yellow-600"><PiHandWithdraw /></div>
            Keuangan
          </Link>
        </div> */}
        {/* content */}
      </div>
    </div>
  );
};

export default Modal;
