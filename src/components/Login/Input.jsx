const Input = ({ label, type, className, placeholder }) => {
    const slugLabel = (text) => {
        return text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
    }
  return (
    <div className="flex flex-col mb-4">
          <label htmlFor={slugLabel(label)} className="text-xs font-medium">{label}</label>
          <input type={ type } id={ slugLabel(label) } placeholder={ placeholder } className={ `${className} border-gray-200 border-2 p-1.5 rounded text-sm` }/>
    </div>
  );
};

export default Input;