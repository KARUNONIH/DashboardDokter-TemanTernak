const Input = ({ label, type, value, onChange }) => {
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor="" className="text-xs">{label}</label>
        <input type={type} value={type === "file" ? "" : value} className="border-gray-300 border focus:outline-none text-sm p-2 rounded" onChange={onChange}/>
        {type === "file" && (
          <a href={value.url} target="_Blank" className="text-xs underline text-blue-600">Klik untuk melihat { value.name }</a>
        )}
      </div>
    );
  };
  
  export default Input;
  