import { useEffect } from "react";
import DashboardHeader from "../components/Riwayat/DashboardHeader";
import Filter from "../components/Riwayat/Filter";
import SearchInput from "../components/Riwayat/SearchInput";
import TabelRiwayat from "../components/Riwayat/TabelRiwayat";
import TabNavigation from "../components/Riwayat/TabNavigation";
import GetAuthorization from "../fetchAPI/GetAuthorization";
import { useAtom } from "jotai";
import { dataUSerAtom } from "../atoms/Atom";

const Riwayat = () => {
  const [dataUser, setDataUSer] = useAtom(dataUSerAtom);

  const endpoint = {
    dataUserUrl: "https://api.temanternak.h14.my.id/users/my"
  };

  const { data: statusUserData, loading: statusUserLoading, error: statusUserError, fetchData: fetchDataUser } = GetAuthorization(endpoint.dataUserUrl, JSON.parse(localStorage.getItem("token")));
  useEffect(() => {
    const fetch = async () => {
      const response = await fetchDataUser();
      if (response) {
        console.log(response);
        setDataUSer(response.data);
      }
    }

    fetch();
  }, []);
  return (
    <div className="min-h-screen bg-slate-50 px-8 py-4">
      <DashboardHeader />
      <TabNavigation />
      <div className="flex justify-between items-center">
        <SearchInput />
        <Filter />
      </div>
      <TabelRiwayat />
    </div>
  );
};

export default Riwayat;
