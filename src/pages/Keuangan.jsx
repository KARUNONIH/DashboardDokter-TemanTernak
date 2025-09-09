import { useAtom } from "jotai";
import FinancialOverview from "../components/Keuangan/FinancialOverview";
import { dataUSerAtom } from "../atoms/Atom";
import { useEffect } from "react";
import GetAuthorization from "../fetchAPI/GetAuthorization";

const Keuangan = () => {
  const [dataUser, setDataUSer] = useAtom(dataUSerAtom);

  const endpoint = {
    dataUserUrl: "/api/users/my",
  };

  const { data: statusUserData, loading: statusUserLoading, error: statusUserError, fetchData: fetchDataUser } = GetAuthorization(endpoint.dataUserUrl, JSON.parse(localStorage.getItem("token")));

  useEffect(() => {
    const dataUSer = async () => {
      const response = await fetchDataUser();
      if (response) {
        setDataUSer(response.data);
      }
    };

    dataUSer();
  }, []);
  return (
    <div className="h-screen w-full bg-slate-50 pt-8">
      <FinancialOverview />
    </div>
  );
};

export default Keuangan;
