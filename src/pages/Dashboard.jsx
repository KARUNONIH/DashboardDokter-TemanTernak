import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { ConsultationDataDashboardAtom, dataUSerAtom, konsultasiTerkiniAtom, sessionSignAtom } from "../atoms/Atom";
import { useNavigate } from "react-router-dom";
import LineChart from "../components/Dashboard/LineChart";
import SummaryCard from "../components/Dashboard/SummaryCard";
import WorkHoursChart from "../components/Dashboard/StatisktikKonsultasi";
import MonthlyEvents from "../components/Dashboard/KonsultasiTerkini";
import EmployeeList from "../components/Dashboard/JadwalUlang";
import Schedule from "../components/Dashboard/JadwalHariIni";
import GetAuthorization from "../fetchAPI/GetAuthorization";

const Dashboard = () => {
  const [dataUser, setDataUSer] = useAtom(dataUSerAtom);
  const [infoDashboard, setInfoDashboard] = useState({ consultationToday: 0, totalConsultation: 0, futureConsultation: 0 });
  const [dataConsultation, setDataConsultation] = useAtom(ConsultationDataDashboardAtom);
  const [KonsultasiTerkini, setKonsultasiTerkini] = useAtom(konsultasiTerkiniAtom);

  const endpoint = {
    dataUserUrl: "https://api.temanternak.h14.my.id/users/my",
    getConsultation: "https://api.temanternak.h14.my.id/users/my/consultations",
  };

  const { data: statusUserData, loading: statusUserLoading, error: statusUserError, fetchData: fetchDataUser } = GetAuthorization(endpoint.dataUserUrl, JSON.parse(localStorage.getItem("token")));
  const { data: consultationData, loading: consultationLoading, error: consultationError, fetchData: fetchConsultation } = GetAuthorization(endpoint.getConsultation, JSON.parse(localStorage.getItem("token")));
  
  const isTodayOrAfter = (dateString, type) => {

    const date = new Date(dateString);
  
    const today = new Date();
  
    if (type === "today") {
      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      );
    } else if (type === "future") {
      return date.getDate() > today.getDate();
    } else {
      return false;
    }
  };
  

  useEffect(() => {
    const fetch = async () => {
      const response = await fetchDataUser();
      if (response) {
        console.log(response);
        setDataUSer(response.data);
      }

      const consultationResponse = await fetchConsultation();
      if (consultationResponse) {
        console.log(consultationResponse);
        setDataConsultation(consultationResponse.data);
        const consultationsToday = consultationResponse.data.filter(item =>
          isTodayOrAfter(item.startTime, "today")
        );

        const totalConsultations = consultationResponse.data.filter(item =>
          item.status === "COMPLETED"
        );

        const consultationsFuture = consultationResponse.data.filter(item =>
          isTodayOrAfter(item.startTime, "future") && item.status === "WAITING"
        );
        setInfoDashboard({ ...infoDashboard, consultationToday: consultationsToday.length, totalConsultation: totalConsultations.length, futureConsultation: consultationsFuture.length });
        setKonsultasiTerkini((prev) => ({
          ...prev,
          upcoming: consultationResponse.data.filter(item => item.status === "WAITING"),
          done: consultationResponse.data.filter(item => item.status === "COMPLETED"),
        }));
      }
    }

    fetch();
  }, []);

  const getGreetingMessage = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return "Good Morning";
    } else if (currentHour >= 12 && currentHour < 17) {
      return "Good Afternoon";
    } else if (currentHour >= 17 && currentHour < 21) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  };

  const getCurrentDate = () => {
    const date = new Date();

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${day} ${month} ${year}`;
  };

  return (
    <div className=" bg-slate-50 px-8 py-4">
      <div className="">
        <h1 className="text-lg font-semibold">
          {getGreetingMessage()}
          <span>, { dataUser.name }!</span>
        </h1>
        <p className="text-sm text-gray-600">{getCurrentDate()}</p>
      </div>
      <div className="w-full">

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 my-6">
            <SummaryCard title="Konsutasi Hari Ini" value={infoDashboard.consultationToday} color="blue" />
            <SummaryCard title="Total Konsultasi" value={infoDashboard.totalConsultation} color="purple" />
            <SummaryCard title="Konsultasi Mendatang" value={infoDashboard.futureConsultation} color="green" />
          </div>

          <div className="flex gap-6 h-[400px]">
            <WorkHoursChart />
            <MonthlyEvents />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-6">
            <EmployeeList />
            <Schedule />
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
