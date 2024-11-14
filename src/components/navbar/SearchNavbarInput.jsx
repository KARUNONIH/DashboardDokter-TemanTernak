import { FaMagnifyingGlass } from "react-icons/fa6";

const SearchNavbarInput = () => {
  return (
    <div className="">
      <form className="w-[300px]">
        <label htmlFor="default-search" className="sr-only mb-2 text-sm font-medium text-gray-900">
          Search
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
            <FaMagnifyingGlass />
          </div>
          <input type="search" id="default-search" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 ps-10 text-sm text-gray-900" placeholder="Search Something..." required />
        </div>
      </form>
    </div>
  );
};

export default SearchNavbarInput;
