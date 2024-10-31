import React from "react";
import { useAtom } from "jotai";
import { isModalOpenAtom, activeFeatureAtom } from "../../atoms/Atom";
import Carousel from "./Carousel";

const Modal = () => {
  const [isModalOpen, setModalOpen] = useAtom(isModalOpenAtom);
  if (!isModalOpen) return null;

  const handleOverlayClick = () => {
    setModalOpen(false);
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-5 z-50" onClick={handleOverlayClick}>
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-2xl" onClick={handleModalContentClick} >
        <button
          className="absolute top-2 right-2 text-xl"
          onClick={() => setModalOpen(false)}
        >
          &times;
        </button>
        <Carousel />
      </div>
    </div>
  );
};

export default Modal;