import { useState, useEffect, useMemo } from "react";
import InputRegistration from "./InputRegistration";
import { useAtom } from "jotai";
import { activeFormRegistrationAtom, formSpecializationAtom, newDataSignupAtom, statusRegistationAtom } from "../../atoms/Atom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const WorkingExperience = () => {
  const [isContinue, setIsContinue] = useState(false);
  const [workingExperiences, setWorkingExperiences] = useState([]);
  const [currentData, setCurrentData] = useState({
    institution: "",
    year: "",
    position: "",
    isActive: false,
  });
  const [errors, setErrors] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statusRegistration, setStatusRegistration] = useAtom(statusRegistationAtom);
  const [dataRegistration, setDataRegistration] = useAtom(newDataSignupAtom);
  const [registration, registrationProggres] = useAtom(activeFormRegistrationAtom);
  const [formSpecializations, setformSpecializations] = useAtom(formSpecializationAtom);
  const [isContinueClicked, setIsContinueClicked] = useState(false);

  const dataRegis = JSON.parse(localStorage.getItem("data"));

  useEffect(() => {
    if (dataRegis?.workingExperiences) {
      setWorkingExperiences(dataRegis?.workingExperiences);
      setCurrentData(dataRegis?.workingExperiences[0]);
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!currentData.institution) newErrors.institution = "Nama institusi wajib diisi.";
    if (!currentData.year) newErrors.year = "Tahun wajib diisi.";
    if (!currentData.position) newErrors.position = "Posisi wajib diisi.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (validate()) {
      // Cek apakah data saat ini sudah ada dalam array workingExperiences
      const isDataExist = workingExperiences.some(
        (work) =>
          work.institution === currentData.institution &&
          work.year === currentData.year &&
          work.position === currentData.position
      );

      // Jika data sudah ada, tidak tambahkan input baru
      if (!isDataExist) {
        setWorkingExperiences((prev) => [...prev, currentData]);
      }

      // Reset form input
      setCurrentData({
        institution: "",
        year: "",
        position: "",
        isActive: false,
      });
      setErrors({}); // Reset errors
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevData = workingExperiences[currentIndex - 1];
      setCurrentData(prevData);
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleContinue = (type) => {
    if (type) {
      setIsContinueClicked(true);
      if (validate()) {
        setDataRegistration((prev) => ({
          ...prev,
          workingExperiences,
        }));
      setIsContinue(true);
         // Ubah sesuai kebutuhan Anda
      }
    } else {
      setformSpecializations("educations");
    }
  };

  useEffect(() => {
    console.log(dataRegistration);
  }, [dataRegistration]);

  const isFormValid = useMemo(() => {
    return currentData.institution && currentData.year && currentData.position;
  }, [currentData]);

  useEffect(() => {
    if (workingExperiences[currentIndex]) {
      setCurrentData(workingExperiences[currentIndex]);
    }
  }, [currentIndex, workingExperiences]);

  useEffect(() => {
    if (isContinue) {
      localStorage.setItem("data", JSON.stringify(dataRegistration));
      setformSpecializations("organizationExperiences");
      setIsContinue(false);
    }
  }, [isContinue]);

  return (
    <div className="px-6">
      <div className="mb-4 flex items-center justify-between">
        <section className="flex items-center gap-2">
          <h1 className="text-lg font-semibold capitalize">Working Experiences</h1>
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
          <p>{workingExperiences.length} data</p>
        </section>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <InputRegistration label="Institution" type="text" value={currentData.institution} onChange={(e) => setCurrentData({ ...currentData, institution: e.target.value })} error={isContinueClicked ? errors.institution : ""} placeholder="Nama Institusi" />
        <InputRegistration label="Year" type="number" value={currentData.year} onChange={(e) => setCurrentData({ ...currentData, year: e.target.value })} error={isContinueClicked ? errors.year : ""} placeholder="Tahun" />
        <InputRegistration label="Position" type="text" value={currentData.position} onChange={(e) => setCurrentData({ ...currentData, position: e.target.value })} error={isContinueClicked ? errors.position : ""} placeholder="Posisi" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Is Active</label>
        <input
          type="checkbox"
          checked={currentData.isActive}
          onChange={(e) => setCurrentData({ ...currentData, isActive: e.target.checked })}
          className="mt-1"
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

export default WorkingExperience;
