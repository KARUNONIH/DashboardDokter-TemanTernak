const DataDashboard = ({ title, data, explanation, logo }) => {
    return (
      <div className="relative border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-white shadow shadow-gray-300  p-4">
        <div className="absolute -top-2 -left-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow shadow-gray-300">
          {logo}
        </div>
        <div className="ml-6">
          <h1 className="text-lg font-semibold text-blue-800">{title}</h1>
          <p className="text-4xl font-bold text-gray-800 mt-2">{data}</p>
          <p className="text-sm text-gray-600 mt-2">{explanation}</p>
        </div>
      </div>
    );
  };
  
  export default DataDashboard;
  