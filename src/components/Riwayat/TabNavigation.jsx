import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { dataRiwayatAtom, filterDataRiwatAtom } from "../../atoms/Atom";
import { FaMagnifyingGlass } from "react-icons/fa6";

const TabNavigation = () => {
  const [filterData, setFilterData] = useAtom(filterDataRiwatAtom);
  const [dataRiwayat, setDataRiwayat] = useAtom(dataRiwayatAtom);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setFilterData(dataRiwayat);
    console.log("data Riwayat", dataRiwayat);
  }, [dataRiwayat]);

  const formatDateTimeRange = (startTimeISO, endTimeISO) => {
    const startDate = new Date(startTimeISO);
    const endDate = new Date(endTimeISO);

    const dateOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const formattedDate = new Intl.DateTimeFormat("id-ID", dateOptions).format(startDate);
    const formattedStartTime = new Intl.DateTimeFormat("id-ID", timeOptions).format(startDate);
    const formattedEndTime = new Intl.DateTimeFormat("id-ID", timeOptions).format(endDate);
    return `${formattedDate} ${formattedStartTime} - ${formattedEndTime}`;
  };

  const handleSearch = (searchTerm) => {
    const filteredData = (dataRiwayat || []).filter(
      (item) => item.bookerName.toLowerCase().includes(searchTerm.toLowerCase()) || formatDateTimeRange(item.startTime, item.endTime).toLowerCase().includes(searchTerm.toLowerCase()) || item.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
      // item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // status(item.isAccepted, item.isSuspended).toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilterData(filteredData);
  };

  const handleInputChange = (value) => {
    setSearch(value);
    handleSearch(value);
  };

  return (
    <div className="flex items-center justify-between border-b-2 border-gray-300">
      <div className="-mb-0.5 flex">
        <button type="button" className={`box-border border-b-4 border-black`} onClick={() => setSettingMenuLayanan({ ...settingMenuLayanan, activeMenu: "konsultasi" })}>
          <p className="p-4">Riwayat Konsultasi</p>
        </button>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex w-[370px] items-center gap-3 rounded bg-gray-50 shadow shadow-gray-300">
          <label htmlFor="input" className="cursor-pointer pl-3 text-xl text-gray-600">
            <FaMagnifyingGlass />
          </label>
          <input type="text" placeholder="Cari nama konsultasi" className="w-full rounded bg-gray-50 p-2 text-sm focus:outline-none" value={search.konsultasi} onChange={(e) => handleInputChange(e.target.value, "konsultasi")} />
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
