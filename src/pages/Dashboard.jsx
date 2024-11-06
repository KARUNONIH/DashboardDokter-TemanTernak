import { useAtom } from "jotai";
import React from "react";
import { sessionSignAtom } from "../atoms/Atom";
import { useNavigate } from "react-router-dom";
import LineChart from "../components/Dashboard/LineChart";
import SummaryCard from "../components/Dashboard/SummaryCard";
import WorkHoursChart from "../components/Dashboard/StatisktikKonsultasi";
import MonthlyEvents from "../components/Dashboard/KonsultasiTerkini";
import EmployeeList from "../components/Dashboard/JadwalUlang";
import Schedule from "../components/Dashboard/JadwalHariIni";

const Dashboard = () => {
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
          <span>, Jhon!</span>
        </h1>
        <p className="text-sm text-gray-600">{getCurrentDate()}</p>
      </div>
      <div className="w-full">

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 my-6">
            <SummaryCard title="Total Employees" value="104" color="blue" />
            <SummaryCard title="Job Applicants" value="1,839" color="purple" />
            <SummaryCard title="Total Payroll" value="$324,920.83" color="green" />
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
