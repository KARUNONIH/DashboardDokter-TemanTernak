import React from "react";
import { useAtom } from "jotai";
import { profileDropdownAtom, sessionSignAtom } from "../../atoms/Atom";
import { FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function ProfileDropdown({}) {
  const [dropdownVisible, setDropdownVisible] = useAtom(profileDropdownAtom);
  const [sessionSign, setsessionSign] = useAtom(sessionSignAtom);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const destroySign = () => {
    localStorage.removeItem('token');
    setsessionSign(false);
  }

  return (
    <div className={`relative hidden md:block`}>
      <div className="flex items-center cursor-pointer p-2" onClick={toggleDropdown}>
        <img src="/asset/stars.png" alt="Profile" className="w-10 h-10 rounded-full" />
        <div className="ml-2">
          <h1 className="font-semibold">Darrell Steward</h1>
          <p className="text-sm text-gray-500">Super admin</p>
        </div>
        <FaChevronDown className="ml-2" />
      </div>

      {dropdownVisible && (
        <div className="absolute right-0 w-48 bg-white rounded-md shadow shadow-gray-300">
          <ul>
            <li className="p-2 hover:bg-gray-200 cursor-pointer">
              <button className="w-full h-full block" onClick={destroySign}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
