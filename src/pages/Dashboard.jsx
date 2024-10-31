import { useAtom } from "jotai";
import React from "react";
import { sessionSignAtom } from "../atoms/Atom";
import { useNavigate } from "react-router-dom";
import LineChart from "../components/Dashboard/LineChart";

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
    <div className="bg-slate-50 min-h-dvh py-4 px-8">
      <div className="">
        <h1 className="text-lg font-semibold">
          {getGreetingMessage()}
          <span>, Jhon!</span>
        </h1>
              <p className="text-sm text-gray-600">{ getCurrentDate() }</p>
      </div>
      <div className="w-full flex">
      {/* <div className="w-[60%] h-max p-4 bg-white shadow mt-4">
      <LineChart/>
      </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
