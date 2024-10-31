const colors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
  };
  
  const Button = ({ color, label, icon, className, onClick }) => {
    return (
      <button
        type="button"
        className={`capitalize rounded ${colors[color]} px-4 py-2 text-center text-sm font-medium text-white focus:outline-none flex items-center h-max ${className}`}
        onClick={onClick}
      >
        {label} <span className="text-xl">{icon}</span>
      </button>
    );
  };
  

export default Button;