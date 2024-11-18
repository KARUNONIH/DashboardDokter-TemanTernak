import { useAtom } from "jotai";
import { statusRegistationAtom } from "../../atoms/Atom";

const InputRegistration = ({ label, type, value, onChange, placeholder, error }) => {
  const [statusRegistration, setStatusRegistration] = useAtom(statusRegistationAtom);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="" className="text-xs">{label}</label>
      <input type={type} value={type === "file" ? "" : value} className="border-gray-300 border focus:outline-none text-sm p-2 rounded" onChange={onChange} placeholder={ placeholder } />
      {type === "file" && value.url && (
        <a href={value.url} target="_Blank" className="text-xs underline text-blue-600">Klik untuk melihat { value.name }</a>
      )}
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
};

export default InputRegistration;