import { useAtom } from "jotai";
import { FaBell } from "react-icons/fa";
import { notificationAtom } from "../../atoms/Atom";
import NotificationContent from "./NotificationContent";

const Notification = () => {
  const [isNotificationVisible, setNotification] = useAtom(notificationAtom);
  const toggleNotification = () => {
    setNotification((condition) => !condition);
  };

  return (
    <div className="relative">
      <button className="flex items-center gap-2" onClick={toggleNotification}>
        <span className="w-8 h-8 bg-blue-600/20 text-blue-600 flex items-center justify-center rounded-full">
          <FaBell />
        </span>
        <span className="text-sm md:text-md font-semibold">10/11</span>
      </button>
          <div className={`${isNotificationVisible ? "max-h-[200px]" : "max-h-0"} max transition-all duration-300 ease-in-out overflow-hidden absolute mt-3.5 w-[312px] shadow shadow-gray-300`}>
              <NotificationContent label={"Konsultasi Baru Telah Masuk"} type={"Video Call"}/>
      </div>
    </div>
  );
};

export default Notification;
