const Input = ({ label, type, value }) => {
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor="" className="text-xs">{label}</label>
        <input type={type} value={value} className="border-gray-300 border focus:outline-none text-sm p-2 rounded"/>
      </div>
    );
  };
  
  export default Input;
  