import { FaInfoCircle } from "react-icons/fa";

const ReschedulePatient = ({ nama, tanggalLama, tanggalBaru, jamLama, jamBaru, logo, status }) => {
  return (
    <div className="flex cursor-pointer items-center justify-between border-b-2 border-gray-300 hover:bg-slate-100">
      <div className="flex items-center gap-2 py-4">
        <section>
          <div className="flex aspect-square h-8 items-center justify-center rounded-full bg-blue-600 text-white">{logo}</div>
        </section>
        <section>
          <h1 className="text-sm font-bold">{nama}</h1>
          <div className="flex items-center gap-3">
            <p className="text-xs">
              Dari {tanggalLama}
              <span> - </span>
              {jamLama}
            </p>
            <p className="text-xs">
              Menjadi {tanggalBaru}
              <span> - </span>
              {jamBaru}
            </p>
          </div>
        </section>
      </div>
      <div className="text-xl">
        <FaInfoCircle />
      </div>
    </div>
  );
};

export default ReschedulePatient;
