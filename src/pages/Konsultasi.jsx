import { useAtom } from "jotai";
import AppointmentsCalendar from "../components/konsultasi/AppointmentsCalendar";
import Modal from "../components/konsultasi/Modal";
import { consultationDataCalendarAtom, dataUSerAtom } from "../atoms/Atom";
import GetAuthorization from "../fetchAPI/GetAuthorization";
import { useEffect, useState } from "react";

const Konsultasi = () => {
  const [dataCalendar, setDataCalendar] = useAtom(consultationDataCalendarAtom);
  const [isFetch, setIsFetch] = useState({ getMe: true, getConsultation: true });
  const [dataUser, setDataUSer] = useAtom(dataUSerAtom);

  const endpoint = {
    getMe: "https://api.temanternak.h14.my.id/users/my",
    getConsultation: "https://api.temanternak.h14.my.id/users/my/consultations",
  };

  const { data: getMeData, loading: getMeLoading, error: getMeError, fetchData: fetchGetMe } = GetAuthorization(endpoint.getMe, JSON.parse(localStorage.getItem("token")));
  const { data: getConsultationData, loading: getConsultationLoading, error: getConsultationError, fetchData: fetchGetConsultation } = GetAuthorization(endpoint.getConsultation, JSON.parse(localStorage.getItem("token")));

  useEffect(() => {
    const fetch = async () => {
      const response = await fetchGetMe();
      if (response) {
        console.log(response);
        setDataUSer(response.data);
        setIsFetch({ ...isFetch, getMe: false });
      }
    };

    if (isFetch.getMe) {
      fetch();
    }
  }, [isFetch.getMe]);

  const changeFormatDate = (originalDate) => {
    const date = new Date(originalDate);

    return date.toISOString().split("T")[0] + "T" + date.toISOString().split("T")[1].split(".")[0];
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await fetchGetConsultation();
      if (response) {
        console.log(response);
        const newData = response.data.map((item) => ({
          start: changeFormatDate(item.startTime),
          end: changeFormatDate(item.endTime),
          backgroundColor: "rgba(192, 38, 211, 0.1)",
          borderColor: "rgba(192, 38, 211, 0.0)",
          extendedProps: {
            title: item.bookerName,
            status: item.status,
            consultationName: item.serviceName,
            bgIcon: "rgba(192, 38, 211, 1)",
            image: `https://ui-avatars.com/api/?name=${item.bookerName}`,
          },
        }));
        setDataCalendar(newData);
        setIsFetch({ ...isFetch, getConsultation: false });
      }
    };

    if (isFetch.getConsultation) {
      fetch();
    }
  }, [isFetch.getConsultation]);

  return (
    <div className="bg-slate-50 px-8 py-4">
      <Modal />
      <AppointmentsCalendar />
    </div>
  );
};

export default Konsultasi;
