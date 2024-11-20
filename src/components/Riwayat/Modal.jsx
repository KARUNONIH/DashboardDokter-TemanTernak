import { useAtom } from "jotai";
import { addServiceDataAtom, dataIdModalRiwayat, editServiceDataAtom, editServiceDataNoIdAtom, modalLayananAtom, modalRiwayatAtom, scheduleDataAtom, typeModalLayananAtom } from "../../atoms/Atom";
import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import Swal from "sweetalert2";
import PostAuthorization from "../../fetchAPI/PostAuthorization";

const Modal = ({ addConsultationResult }) => {
    const [isModalOpen, setModalOpen] = useAtom(modalRiwayatAtom);
    const [idRiwayat, setIdRiwayat] = useAtom(dataIdModalRiwayat);
  //   const [dataService, setDataService] = useAtom(addServiceDataAtom);
  //   const [editdataService, setEditDataService] = useAtom(editServiceDataAtom);
  //   const [typeModal] = useAtom(typeModalLayananAtom);
  //   const [scheduleData, setScheduleData] = useAtom(scheduleDataAtom);
  //   const [editdataServiceNoId, setEditDataServiceNoId] = useAtom(editServiceDataNoIdAtom);

  const endpoint = {
    consultationResult: "https://api.temanternak.h14.my.id/bookings/673869d56866a15fc6096862/consultations/resul",
  };

  const { data: getConsultationsData, loading: getConsultationsLoading, error: getConsultationsError, fetchData: fetchGetConsultation } = PostAuthorization(endpoint.getSConsultation, JSON.parse(localStorage.getItem("token")));

  if (!isModalOpen) return null;

  const handleOverlayClick = () => {
    setModalOpen(false);
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  // const validateDates = (startTime, endTime) => {
  //   const toLocalDate = (date) => {
  //     const utcDate = new Date(date);
  //     // Gunakan waktu lokal berdasarkan zona waktu pengguna
  //     return new Date(
  //       utcDate.getUTCFullYear(),
  //       utcDate.getUTCMonth(),
  //       utcDate.getUTCDate(),
  //       utcDate.getUTCHours(),
  //       utcDate.getUTCMinutes(),
  //       utcDate.getUTCSeconds()
  //     );
  //   };

  //   // Konversi ke waktu lokal berdasarkan zona waktu lokal pengguna
  //   const startDate = toLocalDate(startTime);
  //   const endDate = toLocalDate(endTime);

  //   // Periksa apakah tanggal dalam hari yang sama
  //   if (
  //     startDate.getFullYear() !== endDate.getFullYear() ||
  //     startDate.getMonth() !== endDate.getMonth() ||
  //     startDate.getDate() !== endDate.getDate()
  //   ) {
  //     console.log(startDate, endDate);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Tanggal Tidak Valid",
  //       text: "Tanggal harus di hari yang sama.",
  //     });
  //     return false;
  //   }

  //   // Periksa apakah waktu mulai lebih awal daripada waktu akhir
  //   if (startDate >= endDate) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Waktu Tidak Valid",
  //       text: "Waktu mulai harus lebih awal daripada waktu akhir.",
  //     });
  //     return false;
  //   }

  //   return true;
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeModal === "add") {
      addService();
    } else if (typeModal === "edit") {
      editService();
    } else if (typeModal === "schedule") {
      addSchedule();
      // if (validateDates(scheduleData.startTime, scheduleData.endTime)) {
      // }
    }
  };

  const handleDateChange = (inputDate, type) => {
    const date = new Date(inputDate);

    if (type === "startTime") {
      date.setSeconds(date.getSeconds() + 1);
    }

    const isoString = date.toISOString();

    console.log(isoString);
    setScheduleData({ ...scheduleData, [type]: isoString });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-5" onClick={handleOverlayClick}>
      <form className="relative w-full max-w-xl rounded-lg bg-white p-4 shadow-lg" onClick={handleModalContentClick} onSubmit={handleSubmit}>
        <div className="absolute -right-4 -top-4 flex aspect-square h-10 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-white text-4xl text-black" onClick={() => setModalOpen(false)}>
          <IoIosClose />
        </div>
        <h1 className="text-center text-xl font-semibold">Membuat Hasil Konsultasi</h1>
        <p className="mt-2 text-center text-sm text-gray-600">Hasil Konsultasi yang ditampilkan melanjutkan dari yang dibuat ketika konsultsai sedang berlangsung</p>
        {/* content */}
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
