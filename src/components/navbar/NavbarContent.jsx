import ButtonToggleSidebar from "./ButtonToggleSidebar";
import Divider from "./Divider";
import Notification from "./Notification";
import ProfileDropdown from "./ProfileDropdown";
import SearchNavbarInput from "./SearchNavbarInput";

const NavbarContent = () => {
  return (
    <div className="flex items-center gap-3">
      <SearchNavbarInput />
      {/* <Divider /> */}
      {/* <Notification /> */}
      <Divider />
      <ButtonToggleSidebar className={"block md:hidden"} />
      <ProfileDropdown />
    </div>
  );
};

export default NavbarContent;
