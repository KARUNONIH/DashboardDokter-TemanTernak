import { useAtom } from "jotai";
import Kategori from "../components/Pengaturan/Kategori";
import GetAuthorization from "../fetchAPI/GetAuthorization";
import { dataUSerAtom, dataRegistrationUserAtom } from "../atoms/Atom";
import { useEffect } from "react";

const Pengaturan = () => {
  const [dataUser, setDataUSer] = useAtom(dataUSerAtom);
  const [dataRegistrationUser, setDataRegistrationUser] = useAtom(dataRegistrationUserAtom);

  const endpoint = {
    dataUserUrl: "https://api.temanternak.h14.my.id/users/my",
    dataRegistrationUSerUrl: "https://api.temanternak.h14.my.id/users/my/registrations"
  };

  const { data: statusUserData, loading: statusUserLoading, error: statusUserError, fetchData: fetchDataUser } = GetAuthorization(endpoint.dataUserUrl, JSON.parse(localStorage.getItem("token")));
  const { data: dataRegistrationUserData, loading: dataRegistrationUserLoading, error: dataRegistrationUserError, fetchData: fetchDataRegistrationUser } = GetAuthorization(endpoint.dataRegistrationUSerUrl, JSON.parse(localStorage.getItem("token")));

  // const restructureData = (data) => {
  //   const newData = { generalIdentity: { frontTitle: data.frontTitle, backTitle: data.backTitle, dateOfBirth: data.dateOfBirth, whatsappNumber: data.whatsappNumber, formalPictureId: data.formalPictureFilePath, nik: data.nik, ktpFileId: ktpFilePath, biodata: data.biodata }, license: { strvFileId: "", strvValidUntil: "", strvNumber: "", sipFileId: "", sipValidUntil: "", sipNumber: "" }, specializations: [""], educations: [{ institution: "", year: "", program: "", title: "" }], workingExperiences: [{ institution: "", year: "", position: "", isActive: false }], organizationExperiences: [{ institution: "", year: "", position: "", isActive: false }], bankAndTax: { npwp: "", npwpFileId: "", bankName: "", bankAccountNumber: "", bankAccountName: "", bankAccountFileId: "" }, invitationId: "672c453aa5f2b31aa20ca552" }
  // }

  useEffect(() => {
    const dataUSer = async () => {
      const response = await fetchDataUser();
      if (response) {
        setDataUSer(response.data);
      }
    }

    const dataRegistrationUSer = async () => {
      const response = await fetchDataRegistrationUser();
      if (response) {
        restructureData(response.data);
      }
    }

    dataRegistrationUSer();
    dataUSer();
  }, []);

  const dataInput = [
    { label: "Gelar Depan", type: "text", value: "something" },

  ]
  return (
    <div className="w-4/5 mx-auto mt-10">
      <Kategori label={"generalIdentity"} data={dataInput} type={"basic"}/>
    </div>
  );
};

export default Pengaturan;
