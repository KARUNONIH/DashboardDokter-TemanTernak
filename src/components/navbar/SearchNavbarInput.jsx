import { FaMagnifyingGlass } from "react-icons/fa6";

const SearchNavbarInput = () => {
  return (
    <div className="">
      <form class="w-[300px]">
        <label htmlFor="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only ">
          Search
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <FaMagnifyingGlass />
          </div>
          <input type="search" id="default-search" class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 " placeholder="Search Something..." required />
        </div>
      </form>
    </div>
  );
};

export default SearchNavbarInput;
