import { FaInfoCircle } from "react-icons/fa";

const RecentPatient = ({nama, tanggal , jam, logo, status}) => {
  return (
    <div className="flex justify-between items-center border-b-2 border-gray-300 cursor-pointer hover:bg-slate-100">
    <div className="flex items-center py-4 gap-2">
      <section>
        <div className="h-8 aspect-square flex justify-center items-center bg-blue-600 text-white rounded-full">
          {logo}
        </div>
      </section>
      <section>
        <h1 className="text-sm font-bold">{nama}</h1>
        <p className="text-xs">
          {tanggal}<span> - </span>{jam}
        </p>
      </section>
      </div>
      <div className="text-xl"><FaInfoCircle /></div>
      </div>
  );
};

export default RecentPatient;
