import { useAtom } from "jotai";
import { errorSignupAtom, errorSignuSpecializationAtom, fileNameSignupAtom } from "../../atoms/Atom";

const Input = ({ label, type, className, placeholder, onchange, error, value, checked }) => {
  const [errors, setErrors] = useAtom(errorSignupAtom);
  const [fileName, setFileName] = useAtom(fileNameSignupAtom);
  const [errorsSpecializations, setErrorsSpecializations] = useAtom(errorSignuSpecializationAtom);
  // console.log(errors);
  // console.log(value);
  // console.log(errors);

  const slugLabel = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");
  };
  return (
    <div className="mb-4 flex flex-col">
      <label htmlFor={slugLabel(label)} className="text-xs font-medium">
        {label}
      </label>
      <input type={type} id={slugLabel(label)} placeholder={placeholder} className={`${className} rounded border-2 border-gray-200 p-1.5 text-sm`} onChange={onchange} value={value}  />
      {errorsSpecializations?.[error] && <p className="text-xs text-red-600">{errorsSpecializations[error]}</p>}
      {errors?.[error] && <p className="text-xs text-red-600">{errors[error]}</p>}
      {type === "file" && <p className="text-xs text-black">{ fileName[error] }</p>}
    </div>
  );
};

export default Input;
