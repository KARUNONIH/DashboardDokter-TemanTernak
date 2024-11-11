const GeneralData = ({logo, label, data, time}) => {
  return (
    <div className="flex gap-2">
          <div className="h-8 aspect-square bg-gray-200 rounded text-gray-600 flex items-center justify-center">
              {logo}
          </div>
          <section>
              <h1 className="uppercase text-gray-600 text-xs">{label}</h1>
              <p className="capitalize font-medium text-xs">{ data }</p>
              <p className="capitalize font-medium text-xs">{ time }</p>
          </section>
    </div>
  );
};

export default GeneralData;