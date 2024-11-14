import { useAtom } from "jotai";
import { dataLayananAtom, filterDataLayananKonsultasiJadwalAtom, modalLayananAtom, settingMenuLayananAtom, typeModalLayananAtom } from "../../atoms/Atom";
import { FaPlus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

const Menu = () => {
  const [settingMenuLayanan, setSettingMenuLayanan] = useAtom(settingMenuLayananAtom);
  const [isModalOpen, setModalOpen] = useAtom(modalLayananAtom);
  const [dataLayanan] = useAtom(dataLayananAtom);
  const [search, setSearch] = useState({ konsultasi: "", layanan: "", jadwal: "" });
  const [filterData, setFilterData] = useAtom(filterDataLayananKonsultasiJadwalAtom);
  const [typeModal, setTypeModal] = useAtom(typeModalLayananAtom);

  useEffect(() => {
    setModalOpen(false);
  }, []);

  

  useEffect(() => {
    setFilterData({ ...filterData, layanan: dataLayanan.layanan, jadwal: dataLayanan.jadwal, konsultasi: dataLayanan.konsultasi});
    console.log("data Layanan",dataLayanan);
  }, [dataLayanan]);

  const formatDateTime = (dateString) => {
    console.log(dateString);
    const date = new Date(dateString);
    const userTimeOffset = date.getTimezoneOffset();
    
    date.setMinutes(date.getMinutes() - userTimeOffset);
    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };
    
    return new Intl.DateTimeFormat('id-ID', options).format(date);
  };
  
  const status = (isAccepted, isSuspended) => {
    return isAccepted && !isSuspended ? "approved" : !isAccepted && !isSuspended ? "pending" : "suspended";
  }

  const formatDateTimeRange = (startTimeISO, endTimeISO) => {
    console.log(startTimeISO, endTimeISO);
    const startDate = new Date(startTimeISO);
    const endDate = new Date(endTimeISO);
    
    const userTimeOffset = startDate.getTimezoneOffset();
    
    startDate.setMinutes(startDate.getMinutes() - userTimeOffset);
    endDate.setMinutes(endDate.getMinutes() - userTimeOffset);
    
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

    // const gmtOffset = -new Date().getTimezoneOffset() / 60;
    // const gmtString = `GMT${gmtOffset >= 0 ? "+" : ""}${gmtOffset}`;

    return `${formattedDate} ${formattedStartTime} - ${formattedEndTime}`;
  };

  const handleSearch = (searchTerm, type) => {
    if (type === "layanan") {
      const filteredData = (dataLayanan.layanan || []).filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        status(item.isAccepted, item.isSuspended).toLowerCase().includes(searchTerm.toLowerCase()) 
      );
      setFilterData({ ...filterData, layanan: filteredData });
    } else if(type === "jadwal"){
      const filteredData = (dataLayanan.jadwal || []).filter((item) =>
        formatDateTime(item.start_time).toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDateTime(item.end_time).toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilterData({ ...filterData, jadwal: filteredData });
    } else if (type === "konsultasi") {
      console.log("sf", dataLayanan.konsultasi);
      const filteredData = (dataLayanan.konsultasi || []).filter((item) =>
        item.booker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatDateTimeRange(item.startTime, item.endTime).toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilterData({ ...filterData, konsultasi: filteredData });
    }
  };

  

  const handleInputChange = (value, type) => {
    setSearch({...search, [type]: value});
    handleSearch(value, type);
  };

  return (
    <div className="flex items-center justify-between border-b-2 border-gray-300">
      <div className="-mb-0.5 flex">
        <button type="button" className={`${settingMenuLayanan.activeMenu === "konsultasi" ? "border-b-4 border-black" : ""} box-border`} onClick={() => setSettingMenuLayanan({ ...settingMenuLayanan, activeMenu: "konsultasi" })}>
          <p className="p-4">Konsultasi</p>
        </button>
        <button type="button" className={`${settingMenuLayanan.activeMenu === "layanan" ? "border-b-4 border-black" : ""} box-border`} onClick={() => setSettingMenuLayanan({ ...settingMenuLayanan, activeMenu: "layanan" })}>
          <p className="p-4">Layanan</p>
        </button>
        <button type="button" className={`${settingMenuLayanan.activeMenu === "jadwal" ? "border-b-4 border-black" : ""} box-border`} onClick={() => setSettingMenuLayanan({ ...settingMenuLayanan, activeMenu: "jadwal" })}>
          <p className="p-4">Jadwal</p>
        </button>
      </div>
      {settingMenuLayanan.activeMenu === "konsultasi" && (
        <div className="flex items-center gap-4">
        <div className="flex w-[370px] items-center gap-3 rounded bg-gray-50 shadow shadow-gray-300">
          <label htmlFor="input" className="cursor-pointer pl-3 text-xl text-gray-600">
            <FaMagnifyingGlass />
          </label>
          <input type="text" placeholder="Cari nama konsultasi" className="w-full rounded bg-gray-50 p-2 text-sm focus:outline-none" value={search.konsultasi} onChange={(e) => handleInputChange(e.target.value, "konsultasi")}/>
        </div>
      </div>
      )}
      {settingMenuLayanan.activeMenu === "layanan" && (
        <div className="flex items-center gap-4">
          <div className="flex w-[370px] items-center gap-3 rounded bg-gray-50 shadow shadow-gray-300">
            <label htmlFor="input" className="cursor-pointer pl-3 text-xl text-gray-600">
              <FaMagnifyingGlass />
            </label>
            <input type="text" placeholder="Cari nama layanan" className="w-full rounded bg-gray-50 p-2 text-sm focus:outline-none" value={search.layanan} onChange={(e) => handleInputChange(e.target.value, "layanan")} />
          </div>
          <button className="flex items-center gap-2 rounded border-2 border-gray-300 px-2 py-1 hover:bg-gray-100" onClick={() => {
            setTypeModal("add");
            setModalOpen(true)
          }}>
            <section className="text-gray-600">
              <FaPlus />
            </section>
            <p className="text-sm">Layanan</p>
          </button>
        </div>
      )}
      {settingMenuLayanan.activeMenu === "jadwal" && (
        <div className="flex items-center gap-4">
        <div className="flex w-[370px] items-center gap-3 rounded bg-gray-50 shadow shadow-gray-300">
          <label htmlFor="input" className="cursor-pointer pl-3 text-xl text-gray-600">
            <FaMagnifyingGlass />
          </label>
          <input type="text" placeholder="Cari jadwal konsultasi" className="w-full rounded bg-gray-50 p-2 text-sm focus:outline-none" value={search.jadwal} onChange={(e) => handleInputChange(e.target.value, "jadwal")}/>
        </div>
        <button className="flex items-center gap-2 rounded border-2 border-gray-300 px-2 py-1 hover:bg-gray-100" onClick={() => {
          setTypeModal("schedule");
          setModalOpen(true)
        }}>
          <section className="text-gray-600">
            <FaPlus />
          </section>
          <p className="text-sm">Jadwal</p>
        </button>
      </div>
      )}
    </div>
  );
};

export default Menu;
