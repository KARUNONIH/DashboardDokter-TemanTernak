import { useAtom } from "jotai";
import { recentPatientAtom } from "../../atoms/Atom";

const ButtonChangeRecentPatient = ({ label, onClick }) => {
  const [recentPatient] = useAtom(recentPatientAtom);
  return (
    <button type="button" className={`flex-1 rounded ${recentPatient === label && "bg-white text-blue-600"} px-2 py-1 text-xs font-semibold`} onClick={onClick}>
      {label}
    </button>
  );
};

export default ButtonChangeRecentPatient;
