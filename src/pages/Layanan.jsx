import { useAtom } from "jotai";
import Info from "../components/Layanan/Info";
import Menu from "../components/Layanan/Menu";
import Modal from "../components/Layanan/Modal";
import Table from "../components/Layanan/Table";
import PostAuthorization from "../fetchAPI/PostAuthorization";
import Get from "../fetchAPI/Get";
import { addServiceDataAtom, bookingsDataAtom, dataLayananAtom, dataUSerAtom, editServiceDataAtom, editServiceDataNoIdAtom, lengthOfConsultationAtom, modalLayananAtom, scheduleDataAtom } from "../atoms/Atom";
import GetAuthorization from "../fetchAPI/GetAuthorization";
import { useEffect, useState } from "react";
import PutAuthorization from "../fetchAPI/PutAuthorization";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import Videoroom from "../components/Layanan/VideoRoom";

const Layanan = () => {
  const [dataService, setDataService] = useAtom(addServiceDataAtom);
  const [dataUser, setDataUSer] = useAtom(dataUSerAtom);
  const [dataLayanan, setDataLayanan] = useAtom(dataLayananAtom);
  const [editdataService, setEditDataService] = useAtom(editServiceDataAtom);
  const [removeId, setRemoveId] = useState(editdataService);
  const [editdataServiceNoId, setEditDataServiceNoId] = useAtom(editServiceDataNoIdAtom);
  const [isModalOpen, setModalOpen] = useAtom(modalLayananAtom);
  const [scheduleData, setScheduleData] = useAtom(scheduleDataAtom);
  const [isFetch, setIsFetch] = useState(true);
  const [bookings, setBookings] = useAtom(bookingsDataAtom);
  const [lengthOfConsultations, setLengthOfConsultations] = useAtom(lengthOfConsultationAtom);

  const endpoint = {
    getMe: "https://api.temanternak.h14.my.id/users/my",
    getBookings: "https://api.temanternak.h14.my.id/bookings",
    getOnlyService: "https://api.temanternak.h14.my.id/users/my/services",
    addService: "https://api.temanternak.h14.my.id/veterinarians/services",
    getAllService: "https://api.temanternak.h14.my.id/veterinarians/",
    editService: "https://api.temanternak.h14.my.id/veterinarians/services/",
    addSchedule: "https://api.temanternak.h14.my.id/veterinarians/schedules",
  };

  const { data: addServiceData, loading: addServiceLoading, error: addServiceError, fetchData: fetchAddService } = PostAuthorization(endpoint.addService, dataService, JSON.parse(localStorage.getItem("token")));
  const { data: addScheduleData, loading: addScheduleLoading, error: addScheduleError, fetchData: fetchAddSchedule } = PostAuthorization(endpoint.addSchedule, scheduleData, JSON.parse(localStorage.getItem("token")));
  const { data: getAllServiceData, loading: getAllServiceLoading, error: getAllServiceError, fetchData: fetchGetAllService } = Get(endpoint.getAllService + dataUser.id);
  const { data: editServiceData, loading: editServiceLoading, error: editServiceError, fetchData: fetchEditService } = PutAuthorization(endpoint.editService + editdataService.id, editdataServiceNoId, JSON.parse(localStorage.getItem("token")));
  const { data: getMeData, loading: getMeLoading, error: getMeError, fetchData: fetchGetMe } = GetAuthorization(endpoint.getMe, JSON.parse(localStorage.getItem("token")));
  const { data: getOnlyServiceData, loading: getOnlyServiceLoading, error: getOnlyServiceError, fetchData: fetchGetOnlyService } = GetAuthorization(endpoint.getOnlyService, JSON.parse(localStorage.getItem("token")));
  const { data: getBookingsData, loading: getBookingsLoading, error: getBookingsError, fetchData: fetchGetBookings } = GetAuthorization(endpoint.getBookings, JSON.parse(localStorage.getItem("token")));

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const hasFilter = params.has('id');

  useEffect(() => {
    const fetchDataSequential = async () => {
      const meResponse = await fetchGetMe();
      if (meResponse) {
        setDataUSer(meResponse.data);
      }

      const onlyServiceResponse = await fetchGetOnlyService();
      if (onlyServiceResponse) {
        setDataLayanan((prev) => ({ ...prev, layanan: onlyServiceResponse.data }));
        setLengthOfConsultations((prev) => ({ ...prev, layanan: onlyServiceResponse.data.length }));
      }

      const bookingsResponse = await fetchGetBookings();
      if (bookingsResponse) {
        console.log(bookingsResponse);
        const confirmBookings = bookingsResponse.data.filter((item) =>
          item.status === "CONFIRMED"
        );
        setDataLayanan((prev) => ({ ...prev, konsultasi: confirmBookings }));
        setLengthOfConsultations((prev) => ({ ...prev, konsultasi: confirmBookings.length }));
      }
    };

    fetchDataSequential();
  }, []);

  useEffect(() => {
    const fetchDataWithId = async () => {
      if (dataUser.id) {
        const respoonse = await fetchGetAllService(endpoint.getAllService + dataUser.id);
        if (respoonse) {
          setDataLayanan((prev) => ({ ...prev, jadwal: respoonse.data.schedules }));
          setLengthOfConsultations((prev) => ({ ...prev, jadwal: respoonse.data.schedules.length }));
        }
      }
    };

    fetchDataWithId();
  }, [dataUser.id]);

  const addService = async () => {
    console.log(dataService);
    const response = await fetchAddService();
    if (response) {
      Swal.fire({
        icon: "success",
        title: "Layanan Berhasil Ditambahkan!",
        text: "Layanan Anda telah berhasil ditambahkan dan akan diverifikasi oleh admin.",
        confirmButtonText: "OK",
      });
      console.log(response);
      setModalOpen(true);
      setDataService({ price: "", duration: "", description: "", name: "" });
      setIsFetch(true);
    } else {
      console.error(addServiceError);
    }
  };

  const editService = async () => {
    const response = await fetchEditService();
    if (response) {
      Swal.fire({
        icon: "success",
        title: "Layanan Berhasil dirubah!",
        text: "Layanan Anda telah berhasil dirubah dan akan diverifikasi oleh admin.",
        confirmButtonText: "OK",
      });
      console.log(response);
      setModalOpen(false);
      setEditDataService({ id: "", price: "", duration: "", description: "", name: "" });
      setIsFetch(true);
    } else {
      console.error(editServiceError);
    }
  };

  const addSchedule = async () => {
    const response = await fetchAddSchedule();
    if (response) {
      Swal.fire({
        icon: "success",
        title: "Jadwal Berhasil Ditambahkan!",
        text: "Jadwal Anda telah berhasil Ditambahkan dan langsung akan ditampilkan.",
      });
      console.log(response);
      setModalOpen(false);
      setScheduleData({ startTime: "", endTime: "" });
    } else {
      Swal.fire({
        icon: "error",
        title: "Jadwal gagal Ditambahkan!",
        text: "Jadwal Anda Overlapping jadwal yang lainnya.",
      });
      console.log(addScheduleError);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-4">
  {hasFilter ? (
    <Videoroom />
  ) : (
    <>
      <Modal addService={addService} editService={editService} addSchedule={addSchedule} />
      <Info />
      <div className="mt-10">
        <Menu />
        <div className="">
          <Table />
        </div>
      </div>
    </>
  )}
</div>
  );
};

export default Layanan;
