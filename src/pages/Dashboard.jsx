import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { ConsultationDataDashboardAtom, dataDashboardAtom, dataUSerAtom, konsultasiTerkiniAtom, sessionSignAtom } from "../atoms/Atom";
import { useNavigate } from "react-router-dom";
import LineChart from "../components/Dashboard/LineChart";
import SummaryCard from "../components/Dashboard/SummaryCard";
import EmployeeList from "../components/Dashboard/JadwalUlang";
import Schedule from "../components/Dashboard/JadwalHariIni";
import GetAuthorization from "../fetchAPI/GetAuthorization";
import StatisktikKonsultasi from "../components/Dashboard/StatisktikKonsultasi";
import RecentConsultation from "../components/Dashboard/RecentConsultation";

const Dashboard = () => {
  const [dataUser, setDataUSer] = useAtom(dataUSerAtom);
  const [infoDashboard, setInfoDashboard] = useState({ consultationToday: 0, totalConsultation: 0, futureConsultation: 0 });
  const [dataConsultation, setDataConsultation] = useAtom(ConsultationDataDashboardAtom);
  const [KonsultasiTerkini, setKonsultasiTerkini] = useAtom(konsultasiTerkiniAtom);
  const [DataDashboard, setDataDashboard] = useAtom(dataDashboardAtom);

  const endpoint = {
    dataUserUrl: "https://api.temanternak.h14.my.id/users/my",
    getConsultation: "https://api.temanternak.h14.my.id/users/my/consultations",
    getDataDashboard: "https://api.temanternak.h14.my.id/dashboard/veterinarian",
    getSchedule: "https://api.temanternak.h14.my.id/users/my/schedules",
    getService: "https://api.temanternak.h14.my.id/users/my/services",
  };

  const { data: statusUserData, loading: statusUserLoading, error: statusUserError, fetchData: fetchDataUser } = GetAuthorization(endpoint.dataUserUrl, JSON.parse(localStorage.getItem("token")));
  const { data: consultationData, loading: consultationLoading, error: consultationError, fetchData: fetchConsultation } = GetAuthorization(endpoint.getConsultation, JSON.parse(localStorage.getItem("token")));
  const { data: dataDashboardData, loading: dataDashboardLoading, error: dataDashboardError, fetchData: fetchDataDashboard } = GetAuthorization(endpoint.getDataDashboard, JSON.parse(localStorage.getItem("token")));
  const { data: ScheduleData, loading: ScheduleLoading, error: ScheduleError, fetchData: fetchSchedule } = GetAuthorization(endpoint.getSchedule, JSON.parse(localStorage.getItem("token")));
  const { data: serviceData, loading: serviceLoading, error: serviceError, fetchData: fetchService } = GetAuthorization(endpoint.getService, JSON.parse(localStorage.getItem("token")));
  
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
          isTodayOrAfter(item.startTime, "today") && item.status === "WAITING"
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

      const dataDashboardResponse = await fetchDataDashboard();
      if (dataDashboardResponse) {
        setDataDashboard((prev) => ({
          ...prev,
          totalTransactionsAmount: dataDashboardResponse.data.totalTransactionsAmount,
          averageRating: dataDashboardResponse.data.averageRating
        }));
      }

      const scheduleResponse = await fetchSchedule();
      if (scheduleResponse) {
        setDataDashboard((prev) => ({
          ...prev,
          futureSchedule: scheduleResponse.data.filter(item => {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const startTime = new Date(item.startTime); 
            return startTime >= tomorrow;
          }).length
        }));
      }

      const serviceResponse = await fetchService();
      if (serviceResponse) {
        setDataDashboard((prev) => ({
          ...prev,
          approvedService: serviceResponse.data.filter(item => item.isAccepted && !item.isSuspended && !item.isDeleted).length
        }))
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 my-6 relative z-0">
            <SummaryCard title="Konsutasi Hari Ini" value={infoDashboard.consultationToday} color="blue" />
            <SummaryCard title="Total Konsultasi" value={infoDashboard.totalConsultation} color="purple" />
            <SummaryCard title="Konsultasi Mendatang" value={infoDashboard.futureConsultation} color="green" />
          </div>

          <div className="flex gap-6 h-[400px]">
            <StatisktikKonsultasi />
            <RecentConsultation />
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
