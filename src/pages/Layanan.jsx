import { useAtom } from "jotai";
import Info from "../components/Layanan/Info";
import Menu from "../components/Layanan/Menu";
import Modal from "../components/Layanan/Modal";
import Table from "../components/Layanan/Table";
import PostAuthorization from "../fetchAPI/PostAuthorization";
import Get from "../fetchAPI/Get";
import { addServiceDataAtom, dataLayananAtom, dataUSerAtom, editServiceDataAtom, editServiceDataNoIdAtom, modalLayananAtom, scheduleDataAtom } from "../atoms/Atom";
import GetAuthorization from "../fetchAPI/GetAuthorization";
import { useEffect, useState } from "react";
import PutAuthorization from "../fetchAPI/PutAuthorization";
import Swal from "sweetalert2";

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



  const endpoint = {
    getMe: "https://api.temanternak.h14.my.id/users/my",
    addService: "https://api.temanternak.h14.my.id/veterinarians/services",
    getAllService: "https://api.temanternak.h14.my.id/veterinarians/",
    editService: "https://api.temanternak.h14.my.id/veterinarians/services/",
    addSchedule: "https://api.temanternak.h14.my.id/veterinarians/schedules",
     
  };

  

  const { data: addServiceData, loading: addServiceLoading, error: addServiceError, fetchData: fetchAddService } = PostAuthorization(endpoint.addService, dataService, JSON.parse(localStorage.getItem("token")));
  const { data: addScheduleData, loading: addScheduleLoading, error: addScheduleError, fetchData: fetchAddSchedule } = PostAuthorization(endpoint.addSchedule, scheduleData, JSON.parse(localStorage.getItem("token")));
  const { data: getAllServiceData, loading: getAllServiceLoading, error: getAllServiceError, fetchData: fetchGetAllService } = Get(endpoint.getAllService+dataUser.id);
  const { data: editServiceData, loading: editServiceLoading, error: editServiceError, fetchData: fetchEditService } = PutAuthorization(endpoint.editService + editdataService.id, editdataServiceNoId , JSON.parse(localStorage.getItem("token")));
  const { data: getMeData, loading: getMeLoading, error: getMeError, fetchData: fetchGetMe } = GetAuthorization(endpoint.getMe, JSON.parse(localStorage.getItem("token")));

  useEffect(() => {
    const fetch = async () => {
      const response = await fetchGetMe();
      if (response) {
        console.log(response);
        setDataUSer(response.data);
        setIsFetch(true);
      }
    }

    if (isFetch) { 
      fetch();
    }
  }, [isFetch]);

  useEffect(() => {
    const getAllService = async () => {
      const response = await fetchGetAllService();
      if (response) {
        console.log(response);
        const dataService = Object.values(response.data.services);
        setDataLayanan({...dataLayanan, layanan:dataService});
        setDataLayanan({ ...dataLayanan, jadwal: response.data.schedules });
        setIsFetch(false);
      } else {
        console.error(getAllServiceError);
      }
    }

    if (isFetch) {
      getAllService();
    }
  }, [dataUser, isFetch])

  const addService = async () => {
    console.log(dataService)
    const response = await fetchAddService();
    if (response) {
      Swal.fire({
        icon: 'success',
        title: 'Layanan Berhasil Ditambahkan!',
        text: 'Layanan Anda telah berhasil ditambahkan dan akan diverifikasi oleh admin.',
        confirmButtonText: 'OK'
      });
      console.log(response);
      setModalOpen(true);
      setDataService({ price: "", duration: "", description: "", name: "" });
      setIsFetch(true);
    } else {
      console.error(addServiceError);
    }
  }


  const editService = async () => {
    const response = await fetchEditService();
    if (response) {
      Swal.fire({
        icon: 'success',
        title: 'Layanan Berhasil dirubah!',
        text: 'Layanan Anda telah berhasil dirubah dan akan diverifikasi oleh admin.',
        confirmButtonText: 'OK'
      });
      console.log(response);
      setModalOpen(false);
      setEditDataService({ id: "", price: "", duration: "", description: "", name: "" });
      setIsFetch(true);
    } else {
      console.error(editServiceError);
    }
  }

  const addSchedule = async () => {
    const response = await fetchAddSchedule();
    if (response) {
      Swal.fire({
        icon: 'success',
        title: 'Jadwal Berhasil Ditambahkan!',
        text: 'Jadwal Anda telah berhasil Ditambahkan dan langsung akan ditampilkan.',
      });
      console.log(response);
      setModalOpen(false);
      setScheduleData({ startTime: "", endTime: "" });
    } else {
      console.error(addScheduleError);
    }
  }

  

  return (
    <div className="bg-slate-50 px-8 py-4 min-h-screen">
      <Modal addService={addService} editService={editService} addSchedule={addSchedule} />
      <Info />
      <div className="mt-10">
        <Menu />
        <div className="">
          <Table/>
        </div>
      </div>
      
    </div>
  );
};

export default Layanan;