import { useAtom } from "jotai";
import { sidebarAtom } from "../../atoms/Atom";
import { FaBars } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

const ButtonToggleSidebar = ({ className }) => {
    const [isSidebarVisible, setSidebarVisible] = useAtom(sidebarAtom);
    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    }

    return (
        <button onClick={toggleSidebar} className={`p-2 border-2 border-gray-300 text-gray-600 rounded-md ${className}`}>
          {isSidebarVisible ? <IoClose /> : < FaBars/>}
        </button>
    );
}

export default ButtonToggleSidebar;