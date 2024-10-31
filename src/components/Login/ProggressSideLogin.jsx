const textColor = {
  done: 'text-gray-600',
  current: "text-black",
  notYet: "text-gray-400",
};

const ProggressSideLogin = ({ icon, proggress, detail, condition }) => {
  return (
    <div className="flex gap-3">
      <section>
        <span className={`flex h-10 w-10 items-center justify-center rounded border border-gray-300 ${textColor[condition]}`}>{icon}</span>
      </section>
      <section className="flex flex-col gap-1 items-start">
        <h1 className={`font-semibold ${textColor[condition]} text-base text-nowrap`}>{proggress}</h1>
        <p className={`${textColor[condition]} text-sm text-nowrap`}>{detail}</p>
      </section>
    </div>
  );
};

export default ProggressSideLogin;
