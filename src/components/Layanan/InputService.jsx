const InputService = ({ label, type, placeholder, className, onChange, value }) => {
  return (
      <div className={`flex flex-col gap-1 ${className}`}>
          <label htmlFor="" className="text-sm capitalize">{label}</label>
          <input type={type} name="" id="" placeholder={placeholder} required className={`text-sm border border-gray-300 p-2 rounded`} onChange={ onChange } value={value}/>
    </div>
  );
};

export default InputService;