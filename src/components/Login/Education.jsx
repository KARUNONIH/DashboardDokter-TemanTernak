import { useState, useEffect, useMemo } from "react";
import InputRegistration from "./InputRegistration";
import { useAtom } from "jotai";
import { activeFormRegistrationAtom, formSpecializationAtom, newDataSignupAtom, statusRegistationAtom } from "../../atoms/Atom";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Education = () => {
  const [isContinue, setIsContinue] = useState(false);
  const [educations, setEducations] = useState([]);
  const [currentData, setCurrentData] = useState({
    institution: "",
    year: "",
    program: "",
    title: "",
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
    if (dataRegis?.educations) {
      setEducations(dataRegis?.educations);
      setCurrentData(dataRegis?.educations[0]);
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!currentData.institution) newErrors.institution = "Nama institusi wajib diisi.";
    if (!currentData.year) newErrors.year = "Tahun wajib diisi.";
    if (!currentData.program) newErrors.program = "Program wajib diisi.";
    if (!currentData.title) newErrors.title = "Gelar wajib diisi.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (validate()) {
      // Cek apakah data saat ini sudah ada dalam array educations
      const isDataExist = educations.some((edu) => edu.institution === currentData.institution && edu.year === currentData.year && edu.program === currentData.program && edu.title === currentData.title);

      // Jika data sudah ada, tidak tambahkan input baru
      if (!isDataExist) {
        setEducations((prev) => [...prev, currentData]);
      }

      // Jika data berhasil ditambahkan, cek apakah ada data di index selanjutnya, jika ada, tampilkan
      setCurrentData({
        institution: "",
        year: "",
        program: "",
        title: "",
      });
      setErrors({}); // Reset errors
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevData = educations[currentIndex - 1];
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
          educations,
        }));
      setIsContinue(true);
      }
    } else {
      setformSpecializations("specializations");
    }
  };

  useEffect(() => {
    if (isContinue) {
      localStorage.setItem("data", JSON.stringify(dataRegistration));
      setformSpecializations("workingExperiences");
      setIsContinue(false);
    }
  }, [isContinue]);


  const isFormValid = useMemo(() => {
    return currentData.institution && currentData.year && currentData.program && currentData.title;
  }, [currentData]);

  useEffect(() => {
    // Pastikan untuk memuat data yang benar saat berpindah antar input
    if (educations[currentIndex]) {
      setCurrentData(educations[currentIndex]);
    }
  }, [currentIndex, educations]);


  return (
    <div className="w-[500px] px-6">
      <div className="mb-4 flex items-center justify-between">
        <section className="flex items-center gap-2">
          <h1 className="text-lg font-semibold capitalize">Educations</h1>
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
          <p>{educations.length} data</p>
        </section>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <InputRegistration label="Institution" type="text" value={currentData.institution} onChange={(e) => setCurrentData({ ...currentData, institution: e.target.value })} error={isContinueClicked ? errors.institution : ""} placeholder="Nama Institusi" />
        <InputRegistration label="Year" type="number" value={currentData.year} onChange={(e) => setCurrentData({ ...currentData, year: e.target.value })} error={isContinueClicked ? errors.year : ""} placeholder="Tahun" />
        <InputRegistration label="Program" type="text" value={currentData.program} onChange={(e) => setCurrentData({ ...currentData, program: e.target.value })} error={isContinueClicked ? errors.program : ""} placeholder="Nama Program" />
        <InputRegistration label="Title" type="text" value={currentData.title} onChange={(e) => setCurrentData({ ...currentData, title: e.target.value })} error={isContinueClicked ? errors.title : ""} placeholder="Gelar" />
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

export default Education;
