const DataRiwayat = ({ logo, label, number, data }) => {
  return (
    <div className="flex gap-4">
      <div className="h-10 aspect-square bg-slate-200 flex items-center justify-center rounded-full text-gray-600 text-xl">{logo}</div>
      <div className="">
        <h2 className="text-lg font-medium text-gray-600">{label}</h2>
        <p className="text-2xl font-semibold mt-1">
          Rp{number}
          <span className="text-green-600 ml-3 text-xs">{data}</span>
        </p>
      </div>
    </div>
  );
};

export default DataRiwayat;
