import { useAtom } from "jotai";
import Kategori from "../components/Pengaturan/Kategori";
import GetAuthorization from "../fetchAPI/GetAuthorization";
import { dataUSerAtom, dataRegistrationUserAtom } from "../atoms/Atom";
import { useEffect } from "react";

const Pengaturan = () => {
  const [dataUser, setDataUSer] = useAtom(dataUSerAtom);
  const [dataRegistrationUser, setDataRegistrationUser] = useAtom(dataRegistrationUserAtom);

  const endpoint = {
    dataUserUrl: "https://api-temanternak.test.h14.my.id/users/my",
    dataRegistrationUSerUrl: "https://api-temanternak.test.h14.my.id/users/my/registrations",
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
    <div className="mx-auto my-10 w-4/5">
      <Kategori />
    </div>
  );
};

export default Pengaturan;
