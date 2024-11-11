import Select from "react-select";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";

const Filter = () => {
    const options = [
        {
          value: "calendar",
          label: (
            <div className="flex items-center">
              <FaRegCalendarAlt className="mr-2" /> 1 Desember 2023 - 1 January 2024
            </div>
          ),
        },
        {
          value: "clock",
          label: (
            <div className="flex items-center">
              <FaRegClock className="mr-2" /> 1 January 2023 - 1 Februari 2024
            </div>
          ),
        },
      ];
  return (
    <div className="flex items-center my-6">
         <Select options={options} placeholder="Pilih Rentang Waktu" />
      </div>
  );
};

export default Filter;  