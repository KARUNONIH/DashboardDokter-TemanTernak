import { useAtom } from "jotai";
import FinancialOverview from "../components/Keuangan/FinancialOverview";
import { dataUSerAtom } from "../atoms/Atom";
import { useEffect } from "react";
import GetAuthorization from "../fetchAPI/GetAuthorization";

const Keuangan = () => {
  const [dataUser, setDataUSer] = useAtom(dataUSerAtom);

  const endpoint = {
    dataUserUrl: "https://api.temanternak.h14.my.id/users/my",
  };

  const { data: statusUserData, loading: statusUserLoading, error: statusUserError, fetchData: fetchDataUser } = GetAuthorization(endpoint.dataUserUrl, JSON.parse(localStorage.getItem("token")));


  useEffect(() => {
    const dataUSer = async () => {
      const response = await fetchDataUser();
      if (response) {
        setDataUSer(response.data);
      }
    }

    
    dataUSer();
  }, []);
  return (
    <div className="bg-slate-50 h-screen w-full pt-8">
      <FinancialOverview/>
    </div>
  );
};

export default Keuangan;