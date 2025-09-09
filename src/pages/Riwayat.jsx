import { useEffect } from "react";
import DashboardHeader from "../components/Riwayat/DashboardHeader";
import Filter from "../components/Riwayat/Filter";
import SearchInput from "../components/Riwayat/SearchInput";
import TabelRiwayat from "../components/Riwayat/TabelRiwayat";
import TabNavigation from "../components/Riwayat/TabNavigation";
import GetAuthorization from "../fetchAPI/GetAuthorization";
import { useAtom } from "jotai";
import { dataIdModalRiwayat, dataRiwayatAtom, dataUSerAtom, lengthOfHistoryAtom, modalRiwayatAtom } from "../atoms/Atom";
import Modal from "../components/Riwayat/Modal";

const Riwayat = () => {
  const [dataUser, setDataUSer] = useAtom(dataUSerAtom);
  const [dataRiwayat, setDataRiwayat] = useAtom(dataRiwayatAtom);
  const [lengthHistory, setLengthHistory] = useAtom(lengthOfHistoryAtom);

  const endpoint = {
    dataUserUrl: "http://api-temanternak.test.h14.my.id/users/my",
    getSConsultation: "http://api-temanternak.test.h14.my.id/users/my/consultations",
  };

  const { data: statusUserData, loading: statusUserLoading, error: statusUserError, fetchData: fetchDataUser } = GetAuthorization(endpoint.dataUserUrl, JSON.parse(localStorage.getItem("token")));
  const { data: getConsultationsData, loading: getConsultationsLoading, error: getConsultationsError, fetchData: fetchGetConsultation } = GetAuthorization(endpoint.getSConsultation, JSON.parse(localStorage.getItem("token")));

  useEffect(() => {
    const fetch = async () => {
      const response = await fetchDataUser();
      if (response) {
        console.log(response);
        setDataUSer(response.data);
      }

      const responseconsultation = await fetchGetConsultation();
      if (responseconsultation) {
        console.log(responseconsultation);
        const confirmBookings = responseconsultation.data.filter((item) => item.status !== "WAITING");
        setDataRiwayat(confirmBookings);
        setLengthHistory(confirmBookings);
      }
    };

    fetch();
  }, []);

  const handelSubmit = async () => {};

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-4">
      {/* <DashboardHeader /> */}
      <Modal />
      <TabNavigation />
      <div className="flex items-center justify-between">
        {/* <SearchInput /> */}
        {/* <Filter /> */}
      </div>
      <TabelRiwayat />
    </div>
  );
};

export default Riwayat;
