import React from "react";
import { useAtom } from "jotai";
import { dataUSerAtom, profileDropdownAtom, sessionSignAtom } from "../../atoms/Atom";
import { FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import DestroyAuthorization from "../../fetchAPI/DestroyAuthorization";

function ProfileDropdown({}) {
  const [dropdownVisible, setDropdownVisible] = useAtom(profileDropdownAtom);
  const [sessionSign, setsessionSign] = useAtom(sessionSignAtom);
  const [dataUser, setDataUSer] = useAtom(dataUSerAtom);
  const navigate = useNavigate();

  const { data: signOutData, loading: signOutLoading, error: signOutError, fetchData: fetchSignOut } = DestroyAuthorization("https://api.temanternak.h14.my.id/authentications", JSON.parse(localStorage.getItem("token")));

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const destroySign = async () => {
    const response = await fetchSignOut();
    if (response) {
      localStorage.removeItem("token");
      localStorage.removeItem("data");
      navigate("/");
    }
  };

  return (
    <div className={`relative hidden md:block`}>
      <div className="flex cursor-pointer items-center p-2" onClick={toggleDropdown}>
        <img src="/asset/stars.png" alt="Profile" className="h-10 w-10 rounded-full" />
        <div className="ml-2">
          <h1 className="font-semibold">{dataUser.name}</h1>
          <p className="text-sm text-gray-500">{dataUser.role}</p>
        </div>
        <FaChevronDown className="ml-2" />
      </div>

      {dropdownVisible && (
        <div className="absolute right-0 w-48 rounded-md bg-white shadow shadow-gray-300">
          <ul>
            <li className="cursor-pointer p-2 hover:bg-gray-200">
              <button className="block h-full w-full" onClick={destroySign}>
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
