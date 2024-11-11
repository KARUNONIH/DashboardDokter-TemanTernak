import Input from "./input";

const Kategori = ({ label, data, type }) => {
  return (
    <div className="shadow shadow-gray-300 rounded p-6">
      <h1 className="text-lg font-semibold capitalize mb-4">{label}</h1>
      <div className="grid grid-cols-2 gap-2">
      {data.map((item, index) => (
        <Input key={index} label={item.label} type={item.type} value={item.value} />
      ))}
      </div>
    </div>
  );
};

export default Kategori;
