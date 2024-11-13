import { useAtom } from "jotai";
import { addServiceDataAtom, editServiceDataAtom, editServiceDataNoIdAtom, modalLayananAtom, scheduleDataAtom, typeModalLayananAtom } from "../../atoms/Atom";
import InputService from "./InputService";
import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import Swal from "sweetalert2";


const Modal = ({ addService, editService, addSchedule }) => {
  const [isModalOpen, setModalOpen] = useAtom(modalLayananAtom);
  const [dataService, setDataService] = useAtom(addServiceDataAtom);
  const [editdataService, setEditDataService] = useAtom(editServiceDataAtom);
  const [typeModal] = useAtom(typeModalLayananAtom);
  const [scheduleData, setScheduleData] = useAtom(scheduleDataAtom);
  const [editdataServiceNoId, setEditDataServiceNoId] = useAtom(editServiceDataNoIdAtom);

  if (!isModalOpen) return null;

  const handleOverlayClick = () => {
    setModalOpen(false);
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const validateDates = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start.getFullYear() !== end.getFullYear() || start.getMonth() !== end.getMonth() || start.getDate() !== end.getDate()) {
      Swal.fire({
        icon: 'error',
        title: 'Tanggal Tidak Valid',
        text: 'Tanggal harus di hari yang sama.',
    });
      return false;
    }

    if (start >= end) {
      Swal.fire({
        icon: 'error',
        title: 'Waktu Tidak Valid',
        text: 'Waktu mulai harus lebih awal daripada waktu akhir.',
    });
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeModal === "add") {
      addService();
    } else if (typeModal === "edit") {
      editService();
    } else if (typeModal === "schedule") {
      if (validateDates(scheduleData.startTime, scheduleData.endTime)) {
        addSchedule();
      }
    }
  };

  const handleDateChange = (inputDate, type) => {
    const date = new Date(inputDate);

    const isoString = date.toISOString().slice(0, -5);

    const timezoneOffset = -date.getTimezoneOffset();
    const offsetHours = String(Math.floor(Math.abs(timezoneOffset / 60))).padStart(2, "0");
    const offsetMinutes = String(Math.abs(timezoneOffset % 60)).padStart(2, "0");
    const offsetSign = timezoneOffset >= 0 ? "+" : "-";

    const formatted = `${isoString}${offsetSign}${offsetHours}:${offsetMinutes}`;
    console.log(formatted);
    setScheduleData({ ...scheduleData, [type]: formatted });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-5" onClick={handleOverlayClick}>
      <form className="relative w-full max-w-xl rounded-lg bg-white p-4 shadow-lg" onClick={handleModalContentClick} onSubmit={handleSubmit}>
        <div className="absolute -right-4 -top-4 flex aspect-square h-10 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-white text-4xl text-black" onClick={() => setModalOpen(false)}>
          <IoIosClose />
        </div>
        <h1 className="text-center text-xl font-semibold">
          {typeModal === "add" && "Membuat Layanan Baru"}
          {typeModal === "edit" && "Merubah Layanan Lama"}
          {typeModal === "schedule" && "Membuat Jadwal Tersedia"}
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          {typeModal === "add" && "Layanan akan diverifikasi oleh admin terlebih dahulu."}
          {typeModal === "edit" && "Layanan akan diverifikasi Setelah dirubah."}
          {typeModal === "schedule" && "Jadwal yang dibuat akan langsung digunakan"}
        </p>
        {typeModal === "schedule" && (
          <div className="mt-6 flex gap-2">
            <InputService label={"Waktu Mulai"} type={"datetime-local"} className={"flex-1"} onChange={(e) => handleDateChange(e.target.value, "startTime")} />
            <InputService label={"Waktu Berakhir"} type={"datetime-local"} className={"flex-1"} onChange={(e) => handleDateChange(e.target.value, "endTime")} />
          </div>
        )}
        {(typeModal === "add" || typeModal === "edit") && (
          <div className="mt-6">
            <InputService
              label={"Nama Konsultasi"}
              type={"text"}
              placeholder={"Konsultasi Ceria 50 Menit"}
              onChange={(e) => {
                const value = e.target.value;
                if (typeModal === "add") setDataService({ ...dataService, name: value });
                else {
                  setEditDataService({ ...editdataService, name: value });
                  setEditDataServiceNoId({ ...editdataServiceNoId, name: value });
                }
              }}
              value={typeModal === "add" ? dataService.name : editdataService.name}
            />
            <div className="my-4 flex w-full gap-2">
              <InputService
                label={"Nominal"}
                type={"number"}
                placeholder={"Biaya / sesi"}
                className={"flex-1"}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (typeModal === "add") setDataService({ ...dataService, price: value });
                  else {
                    setEditDataService({ ...editdataService, price: value });
                    setEditDataServiceNoId({ ...editdataServiceNoId, price: value });
                  }
                }}
                value={typeModal === "add" ? dataService.price : editdataService.price}
              />
              <InputService
                label={"Durasi"}
                type={"number"}
                placeholder={"Dalam Menit"}
                className={"flex-1"}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (typeModal === "add") setDataService({ ...dataService, duration: value });
                  else {
                    setEditDataService({ ...editdataService, duration: value });
                    setEditDataServiceNoId({ ...editdataServiceNoId, duration: value });
                  }
                }}
                value={typeModal === "add" ? dataService.duration : editdataService.duration}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm">
                Deskripsi Konsultasi
              </label>
              <textarea
                name=""
                id=""
                className="rounded border border-gray-300 p-2 text-sm"
                rows={3}
                placeholder="Deskripsikan Konsultasi yang Anda Buat"
                required
                onChange={(e) => {
                  const value = e.target.value;
                  if (typeModal === "add") setDataService({ ...dataService, description: value });
                  else {
                    setEditDataService({ ...editdataService, description: value });
                    setEditDataServiceNoId({ ...editdataServiceNoId, description: value });
                  }
                }}
                value={typeModal === "add" ? dataService.description : editdataService.description}
              />
            </div>
          </div>
        )}
        <div className="mt-4 flex flex-row-reverse">
          <button type="submit" className="w-1/2 rounded bg-green-600 py-1 text-white">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Modal;
