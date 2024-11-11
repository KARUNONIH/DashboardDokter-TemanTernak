import React from 'react';
import { FaMagnifyingGlass } from "react-icons/fa6";

const SearchInput = () => {
  return (
      <div className="w-[370px] flex items-center gap-3 bg-gray-200 rounded-full shadow shadow-gray-300">
          <label htmlFor="input" className='cursor-pointer pl-3 text-xl text-gray-600'>
          <FaMagnifyingGlass />
          </label>
      <input
        type="text"
        placeholder="Search name or reservation ID..."
        className="w-full p-2  rounded-r-full bg-gray-200 focus:outline-none text-sm"
      id='input'/>
    </div>
  );
};

export default SearchInput;
