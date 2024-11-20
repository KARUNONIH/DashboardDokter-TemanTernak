import React from "react";
import Button from "./Button";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { navbarCollapseAtom } from "../../atoms/Atom";
import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const Navbar = ({ featureRef, flowRef, jumbotronRef }) => {
  const scrollToSection = (ref, offset = 70) => {
    const elementPosition = ref.current?.getBoundingClientRect().top;
    const offsetPosition = window.pageYOffset + elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  const [navbarCollapse, setNavbarCollapse] = useAtom(navbarCollapseAtom);

  const navbarCollapseFunction = () => {
    setNavbarCollapse((condition) => !condition);
  };

  const navbarButtonIcon = navbarCollapse ? <IoClose /> : <FaBars />;

  return (
    <nav className="sticky start-0 top-0 z-30 w-full bg-white shadow">
      <div className="mx-auto flex w-[80%] flex-wrap items-center justify-between py-2">
        <section className="flex items-center gap-2">
          <img src="/asset/stars.png" className="h-8" alt="Flowbite Logo" />
          <span className="self-center whitespace-nowrap text-2xl font-semibold">Teman Ternak</span>
        </section>
        <div className="flex space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
          <Button color={"green"} label={"Download App"} className="hidden md:block" />
          <button onClick={navbarCollapseFunction} data-collapse-toggle="navbar-sticky" type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden" aria-controls="navbar-sticky" aria-expanded={navbarCollapse}>
            <span className="sr-only">Open main menu</span>
            {navbarButtonIcon}
          </button>
        </div>
        <div className={`w-full items-center justify-between md:order-1 md:h-max md:w-auto ${navbarCollapse ? "h-[200px]" : "h-0"} transition-all duration-300 ease-in-out overflow-hidden`} id="navbar-sticky">
          <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 rtl:space-x-reverse">
            <li>
              <button onClick={() => scrollToSection(jumbotronRef)} className="block rounded bg-blue-700 w-full px-3 py-2 text-sm text-white md:bg-transparent md:p-0 md:text-gray-900" aria-current="page">
                Home
              </button>
            </li>
            {/* <li>
              <Link to="/signup" className="block w-full text-center rounded px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-700">
                Bergabung
              </Link>
            </li> */}
            <li>
              <button onClick={() => scrollToSection(flowRef)} className="block w-full rounded px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-700">
                Konsultasi
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection(featureRef)} className="block w-full rounded px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-700">
                Fitur
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
