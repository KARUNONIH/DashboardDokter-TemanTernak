import { useState, useEffect, useMemo } from "react";
import { useAtom } from "jotai";
import { activeFormRegistrationAtom, formSpecializationAtom, newDataSignupAtom, statusRegistationAtom } from "../../atoms/Atom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import InputRegistration from "./InputRegistration";

const Specializations = () => {
  const [specializations, setSpecializations] = useState([]);
  const [currentSpecialization, setCurrentSpecialization] = useState("");
  const [errors, setErrors] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statusRegistration, setStatusRegistration] = useAtom(statusRegistationAtom);
  const [dataRegistration, setDataRegistration] = useAtom(newDataSignupAtom);
  const [registration, registrationProggres] = useAtom(activeFormRegistrationAtom);
  const [formSpecializations, setformSpecializations] = useAtom(formSpecializationAtom);
  const [isContinueClicked, setIsContinueClicked] = useState(false);

  useEffect(() => {
    if (!statusRegistration && dataRegistration.specializations) {
      setSpecializations(dataRegistration.specializations);
    }
  }, [dataRegistration.specializations, statusRegistration]);

  const validate = () => {
    const newErrors = {};
    if (!currentSpecialization) newErrors.specialization = "Spesialisasi wajib diisi.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (validate()) {
      // Cek apakah spesialisasi sudah ada dalam array specializations
      if (!specializations.includes(currentSpecialization)) {
        setSpecializations((prev) => [...prev, currentSpecialization]);
      }

      // Reset input
      setCurrentSpecialization("");
      setErrors({}); // Reset errors
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentSpecialization(specializations[currentIndex - 1]);
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleContinue = (type) => {
    if (type) {
      setIsContinueClicked(true);
      if (validate()) {
        setDataRegistration((prev) => ({
          ...prev,
          specializations,
        }));
        setformSpecializations("educations");
      }
    } else {
      registrationProggres("proggress2");
    }
  };

  useEffect(() => {
    console.log(dataRegistration);
  }, [dataRegistration]);

  const isFormValid = useMemo(() => {
    return currentSpecialization !== "";
  }, [currentSpecialization]);

  return (
    <div className="px-6 w-[500px]">
      <div className="mb-4 flex items-center justify-between">
        <section className="flex items-center gap-2">
          <h1 className="text-lg font-semibold capitalize">Specializations</h1>
          <div className="flex gap-2">
            {currentIndex > 0 && (
              <button type="button" className="cursor-pointer rounded bg-blue-600 px-1 py-1 text-sm text-white" onClick={handleBack}>
                <IoIosArrowBack />
              </button>
            )}
            <button type="button" className={`flex-1 cursor-pointer rounded ${isFormValid ? "bg-blue-600" : "bg-gray-400"} px-1 py-1 text-sm text-white`} onClick={handleAdd} disabled={!isFormValid}>
              <IoIosArrowForward />
            </button>
          </div>
        </section>
        <section>
          <p>{specializations.length} data</p>
        </section>
      </div>

      <div className="mb-4">
        <InputRegistration
          label="Specialization"
          type="text"
          value={currentSpecialization}
          onChange={(e) => setCurrentSpecialization(e.target.value)}
          error={isContinueClicked ? errors.specialization : ""}
          placeholder="Masukkan spesialisasi"
        />
      </div>

      <div className="flex items-center gap-2">
        <button type="button" className={`flex-1 cursor-pointer rounded bg-blue-600 px-4 py-2 text-sm text-white`} onClick={() => handleContinue(false)}>
          Back
        </button>
        <button type="button" className={`flex-1 cursor-pointer rounded ${isFormValid ? "bg-blue-600" : "bg-gray-400"} px-4 py-2 text-sm text-white`} onClick={() => handleContinue(true)} disabled={!isFormValid}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Specializations;
