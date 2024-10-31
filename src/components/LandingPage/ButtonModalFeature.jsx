import { MdOutlineArrowOutward } from "react-icons/md";
import { useSetAtom } from "jotai";
import { isModalOpenAtom, activeFeatureAtom } from "../../atoms/Atom";

const ButtonModalFeature = ({ featureIndex }) => {
  const setModalOpen = useSetAtom(isModalOpenAtom);
  const setActiveFeature = useSetAtom(activeFeatureAtom);

  const handleClick = () => {
    setActiveFeature(featureIndex);
    setModalOpen(true);
  };
  return (
    <button className="flex items-center gap-2 text-xs font-bold text-green-600" onClick={handleClick}>
      Learn More{" "}
      <span>
        <MdOutlineArrowOutward />
      </span>
    </button>
  );
};

export default ButtonModalFeature;
