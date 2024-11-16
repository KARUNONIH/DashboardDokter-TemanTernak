import Input from "./Input";
import { useAtom } from "jotai";
import {
  activeFormRegistrationAtom,
  formSpecializationAtom,
  sessionSignAtom,
  signupStatusAtom,
  errorApiAtom,
  preSignupAtom,
  loginAtom,
  signupAtom,
  errorSignupAtom,
  fileNameSignupAtom,
  errorSignuSpecializationAtom,
} from "../../atoms/Atom";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const FormRegistration = ({ type, signin, signup, preSignup }) => {
  const [registration, registrationProgress] = useAtom(activeFormRegistrationAtom);
  const [sessionSign, setSessionSign] = useAtom(sessionSignAtom);
  const [formSpecializations, setFormSpecializations] = useAtom(formSpecializationAtom);
  const [signupStatus, setSignupStatus] = useAtom(signupStatusAtom);
  const [errorSignup, setErrorSignup] = useAtom(errorApiAtom);
  const [dataPreSignup, setDataPreSignup] = useAtom(preSignupAtom);
  const [dataLogin, setDataLogin] = useAtom(loginAtom);
  const [dataSignup, setDataSignup] = useAtom(signupAtom);
  const [errors, setErrors] = useAtom(errorSignupAtom);
  const [errorsSpecialization, setErrorsSpecialization] = useAtom(errorSignuSpecializationAtom);
  const [indexArray, setIndexArray] = useState({ specializations: 0, educations: 0, workingExperiences: 0, organizationExperiences: 0 });
  const [fileName, setFileName] = useAtom(fileNameSignupAtom);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token") && registration !== "progress5") {
      registrationProgress("progress1");
    }
  }, []);

  const validatePart = (part) => {
    const validationRules = {
      progress1: [
        { field: 'frontTitle', message: "Gelar depan dibutuhkan" },
        { field: 'backTitle', message: "Gelar belakang dibutuhkan" },
        { field: 'dateOfBirth', message: "Tanggal lahir dibutuhkan" },
        { field: 'whatsappNumber', message: "No whatsapp dibutuhkan" },
        { field: 'formalPictureId', message: "Foto formal dibutuhkan" },
        { field: 'nik', message: "NIK dibutuhkan" },
        { field: 'ktpFileId', message: "KTP dibutuhkan" },
        { field: 'biodata', message: "Biodata dibutuhkan" },
      ],
      progress2: [
        { field: 'strvFileId', message: "File STRV dibutuhkan" },
        { field: 'strvValidUntil', message: "No STRV dibutuhkan" },
        { field: 'strvNumber', message: "Masa Berlaku STRV dibutuhkan" },
        { field: 'sipFileId', message: "File SIP dibutuhkan" },
        { field: 'sipValidUntil', message: "No SIP dibutuhkan" },
        { field: 'sipNumber', message: "Masa Berlaku SIP dibutuhkan" },
      ],
      progress4: [
        { field: 'npwp', message: "NPWP dibutuhkan" },
        { field: 'npwpFileId', message: "File NPWP dibutuhkan" },
        { field: 'bankName', message: "Nama Bank dibutuhkan" },
        { field: 'bankAccountNumber', message: "Nomor rekening dibutuhkan" },
        { field: 'bankAccountName', message: "Nama pemilik bank dibutuhkan" },
        { field: 'bankAccountFileId', message: "Foto Rekening dibutuhkan" },
      ],
    };

    const newErrors = {};
    validationRules[part]?.forEach(({ field, message }) => {
      if (!dataSignup.generalIdentity[field]) {
        newErrors[field] = message;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    validatePart(registration);
    if (dataSignup.specializations) {
      setErrorsSpecialization(null);
    }
  }, [dataSignup, registration, setErrorsSpecialization]);

  const checkForm = (isNext) => {
    const currentProgress = parseInt(registration.slice(-1));

    if (isNext) {
      if (registration === "progress3") {
        if (!dataSignup.specializations[dataSignup.specializations.length - 1]) {
          setErrorsSpecialization({ specializations: "Spesialisasi dibutuhkan" });
        }
        if (checkArray("organizationExperiences") && dataSignup.specializations[dataSignup.specializations.length - 1]) {
          registrationProgress(`progress${currentProgress + 1}`);
        }
      } else {
        validatePart(registration) ? registrationProgress(`progress${currentProgress + 1}`) : registrationProgress(registration);
      }
    } else {
      registrationProgress(`progress${currentProgress - 1}`);
    }
  };

  const signupDataArray = (isNext, category) => {
    if (isNext) {
      if (category === "specializations" && dataSignup.specializations[indexArray.specializations]) {
        setIndexArray((index) => ({ ...index, specializations: index.specializations + 1 }));
      } else if (category === "specializations") {
        setErrorsSpecialization({ specializations: "Spesialisasi dibutuhkan" });
      } else {
        const { institution, year, program, title } = dataSignup[category][indexArray[category]] || {};
        if (institution && year && program && title) {
          setIndexArray((index) => ({ ...index, [category]: index[category] + 1 }));
        } else {
          const allErrors = {};
          for (const [key, value] of Object.entries({ institution, year, program, title })) {
            if (!value) {
              allErrors[`${category}.${key}`] = `${key} dibutuhkan`;
            }
          }
          setErrors(allErrors);
        }
      }
    } else {
      setIndexArray((prevIndexArray) => ({
        ...prevIndexArray,
        [category]: Math.max(prevIndexArray[category] - 1, 0),
      }));
      if (category === "specializations") {
        setErrorsSpecialization(null);
      } else {
        setErrors({});
      }
    }
  };

  const checkArray = (category) => {
    const allError = {};
    if (!dataSignup[category] || !Array.isArray(dataSignup[category]) || dataSignup[category].length === 0) {
      if (category === "specializations") {
        allError["specializations"] = "Spesialisasi dibutuhkan";
      }
      setErrors(allError);
      return false;
    }

    const lastEntry = dataSignup[category][dataSignup[category].length - 1];
    const validateField = (obj, field, path, message) => {
      if (!(field in obj) || !obj[field]) {
        allError[path] = message;
      }
    };

    if (category === "specializations" && !lastEntry) {
      allError["specializations"] = "Spesialisasi dibutuhkan";
    } else if (lastEntry) {
      const validationRules = {
        educations: [
          { field: 'institution', message: "Institution dibutuhkan" },
          { field: 'year', message: "Tahun dibutuhkan" },
          { field: 'program', message: "Program dibutuhkan" },
          { field: 'title', message: "Title dibutuhkan" },
        ],
        workingExperiences: [
          { field: 'institution', message: "Institution dibutuhkan" },
          { field: 'year', message: "Tahun dibutuhkan" },
          { field: 'position', message: "Position dibutuhkan" },
        ],
        organizationExperiences: [
          { field: 'institution', message: "Institution dibutuhkan" },
          { field: 'year', message: "Tahun dibutuhkan" },
          { field: 'position', message: "Position dibutuhkan" },
        ],
      };

      validationRules[category]?.forEach(({ field, message }) => {
        validateField(lastEntry, field, `${category}.${field}`, message);
      });
    }

    setErrors(allError);
    return Object.keys(allError).length === 0;
  };

  const formSpecialization = (action, category) => {
    const typeSpecialization = ["educations", "workingExperiences", "organizationExperiences"];
    const index = typeSpecialization.indexOf(formSpecializations);

    if (action === "prev") {
      setFormSpecializations(typeSpecialization[index - 1]);
    } else {
      if (!dataSignup.specializations[dataSignup.specializations.length - 1]) {
        setErrorsSpecialization ({ specializations: "Spesialisasi dibutuhkan" });
      }
      if (checkArray(category) && dataSignup.specializations[dataSignup.specializations.length - 1]) {
        setFormSpecializations(typeSpecialization[index + 1]);
      }
    }
  };

  const initiateSignin = (e) => {
    e.preventDefault();
    signin();
  };

  const initiateSignup = (e) => {
    e.preventDefault();
    if (validatePart(registration)) {
      signup();
    }
  };

  const initiatePreSignup = (e) => {
    e.preventDefault();
    preSignup();
  };

  const initiateUploadFile = async (file, type, category) => {
    setFileName({ ...fileName, [type]: null });
    const token = JSON.parse(localStorage.getItem("token"));
    const formData = new FormData();
    formData.append("document_type", type);
    formData.append("file", file);

    try {
      const response = await fetch("https://api.temanternak.h14.my.id/users/my/files", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDataSignup({ ...dataSignup, [category]: { ...dataSignup[category], [type]: data.data.id } });
        setFileName({ ...fileName, [type]: file.name });
      } else {
        alert("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };

  const updateArray = (index, value, category, key) => {
    const categoryArray = dataSignup[category] || [];

    if (category === "specializations") {
      if (categoryArray.length <= index) {
        const newSpecializations = [...categoryArray, ...Array(index - categoryArray.length).fill({}), value];
        setDataSignup({ ...dataSignup, specializations: newSpecializations });
      } else {
        setDataSignup({ ...dataSignup, specializations: categoryArray.map((item, i) => (i === index ? value : item)) });
      }
    } else {
      if (categoryArray.length <= index) {
        const newCategoryArray = [...categoryArray, { [key]: value }];
        setDataSignup({ ...dataSignup, [category]: newCategoryArray });
      } else {
        setDataSignup({ ...dataSignup, [category]: categoryArray.map((item, i) => (i === index ? { ...item, [key]: value } : item)) });
      }
    }
  };

  if (registration === "progress5") {
    return (
      <div>
        {signupStatus ? (
          <div>
            <p>Anda sudah terdaftar silahkan login</p>
            <button type="button" className="w-full rounded bg-green-700 py-2 text-white">
              <Link to={"/dashboard"} className="block">Login</Link>
            </button>
          </div>
        ) : (
          <div>
            <p>Berkas anda sedang di verifikasi</p>
          </div>
        )}
      </div>
    );
  } else if (type === "signup") {
    if (registration === "progress0") {
      return (
        <form onSubmit={initiatePreSignup}>
          <div>
            <Input label={"name"} type={"text"} placeholder={"enter your name"} onchange={(e) => setDataPreSignup({ ...dataPreSignup, name: e.target.value })} />
            <Input label={"email"} type={"email"} placeholder={"enter your email"} onchange={(e) => setDataPreSignup({ ...dataPreSignup, email: e.target.value })} />
            <Input label={"password"} type={"password"} placeholder={"enter your password"} onchange={(e) => setDataPreSignup({ ...dataPreSignup, password: e.target.value })} />
            <button type="submit" className="w-full rounded bg-green-700 py-2 text-white">Create Account</button>
          </div>
          <p className="mt-6 text-center text-sm capitalize">
            Already Have an Account?{" "}
            <Link to={"/signin"} className="text-blue-600 underline">sign in</Link>
          </p>
          <p>{JSON.stringify(errorSignup?.email?.[0])}</p>
        </form>
      );
    } else if (registration !== "progress0") {
      return (
        <form onSubmit={initiateSignup} encType="multipart/form-data">
          {registration === "progress1" && (
             <div>
              <div className="flex gap-2">
                <Input label={"Gelar Depan"} type={"text"} placeholder={"Dr."} onchange={(e) => setDataSignup({ ...dataSignup, generalIdentity: { ...dataSignup.generalIdentity, frontTitle: e.target.value } })} error={"frontTitle"} value={dataSignup.generalIdentity.frontTitle || ""} />
                <Input label={"Gelar Belakang"} type={"text"} placeholder={"M.Kes"} onchange={(e) => setDataSignup({ ...dataSignup, generalIdentity: { ...dataSignup.generalIdentity, backTitle: e.target.value } })} error={"backTitle"} value={dataSignup.generalIdentity.backTitle || ""} />
              </div>
              <div className="flex gap-2">
                <Input label={"No Whatsapp"} type={"tel"} placeholder={"081234567890"} onchange={(e) => setDataSignup({ ...dataSignup, generalIdentity: { ...dataSignup.generalIdentity, whatsappNumber: e.target.value } })} error={"whatsappNumber"} value={dataSignup.generalIdentity.whatsappNumber || ""} />
                <Input label={"NIK"} type={"number"} placeholder={"3276030101010001"} onchange={(e) => setDataSignup({ ...dataSignup, generalIdentity: { ...dataSignup.generalIdentity, nik: e.target.value } })} error={"nik"} value={dataSignup.generalIdentity.nik || ""} />
              </div>
              <Input label={"Biodata"} type={"text"} placeholder={"Ahli dibidang kedokteran hewan"} onchange={(e) => setDataSignup({ ...dataSignup, generalIdentity: { ...dataSignup.generalIdentity, biodata: e.target.value } })} error={"biodata"} value={dataSignup.generalIdentity.biodata || ""} />
              <Input label={"Tanggal Lahir"} type={"date"} onchange={(e) => setDataSignup({ ...dataSignup, generalIdentity: { ...dataSignup.generalIdentity, dateOfBirth: e.target.value } })} error={"dateOfBirth"} value={dataSignup.generalIdentity.dateOfBirth || ""} />
              <Input label={"Foto Formal"} type={"file"} accept="image/jpeg, image/png, image/jpg" onchange={(e) => initiateUploadFile(e.target.files[0], "formalPictureId", "generalIdentity")} error={"formalPictureId"} />
              <Input label={"KTP"} type={"file"} placeholder={"Unggah scan KTP"} accept="image/jpeg, image/png, image/jpg" onchange={(e) => initiateUploadFile(e.target.files[0], "ktpFileId", "generalIdentity")} error={"ktpFileId"} />
              <button type="button" className="w-full rounded bg-green-700 py-2 text-white" onClick={() => checkForm(true)}>
                continue
              </button>
            </div>
          )}
          {registration === "progress2" && (
            <div>
              <Input label={"STRV (Surat Tanda Registrasi Veteriner)"} type={"file"} onchange={(e) => initiateUploadFile(e.target.files[0], "strvFileId", "license")} error={"strvFileId"} />
              <div className="flex gap-2">
                <Input label={"No STRV"} type={"text"} placeholder={"STRV123456789"} onchange={(e) => setDataSignup({ ...dataSignup, license: { ...dataSignup.license, strvNumber: e.target.value } })} error={"strvNumber"} value={dataSignup.license.strvNumber} />
                <Input label={"Masa Berlaku STRV"} type={"date"} onchange={(e) => setDataSignup({ ...dataSignup, license: { ...dataSignup.license, strvValidUntil: e.target.value } })} error={"strvValidUntil"} value={dataSignup.license.strvValidUntil} />
              </div>
              <Input label={"SIP (Surat Izin Praktik)"} type={"file"} onchange={(e) => initiateUploadFile(e.target.files[0], "sipFileId", "license")} error={"sipFileId"} />
              <div className="flex gap-2">
                <Input label={"No SIP"} type={"text"} placeholder={"SIP987654321"} onchange={(e) => setDataSignup({ ...dataSignup, license: { ...dataSignup.license, sipNumber: e.target.value } })} error={"sipNumber"} value={dataSignup.license.sipNumber} />
                <Input label={"Masa Berlaku SIP"} type={"date"} onchange={(e) => setDataSignup({ ...dataSignup, license: { ...dataSignup.license, sipValid : e.target.value } })} error={"sipValidUntil"} value={dataSignup.license.sipValidUntil} />
              </div>
              <div className="flex gap-2">
                <button type="button" className="w-full rounded bg-green-700 py-2 text-white" onClick={() => checkForm(false)}>
                  Back
                </button>
                <button type="button" className="w-full rounded bg-green-700 py-2 text-white" onClick={() => checkForm(true)}>
                  continue
                </button>
              </div>
            </div>
          )}
          {registration === "progress3" && (
            <div>
              <div className="flex items-center gap-1">
                <p className="text-sm">Spesialisasi</p>
                <button type="button" className="rounded bg-green-600 p-0.5 text-white" onClick={() => signupDataArray(false, "specializations")}>
                  <IoIosArrowBack />
                </button>
                <button type="button" className="rounded bg-green-600 p-0.5 text-white" onClick={() => signupDataArray(true, "specializations")}>
                  <IoIosArrowForward />
                </button>
              </div>
              <Input label={""} type={"text"} placeholder={"Bedah, Penyakit Dalam"} onchange={(e) => updateArray(indexArray.specializations, e.target.value, "specializations")} error={"specializations"} value={dataSignup.specializations.length > indexArray.specializations ? dataSignup.specializations[indexArray.specializations] : ""} />
              <div className={`${formSpecializations === "educations" ? "block" : "hidden"}`}>
                <div className="flex items-center gap-1">
                  <p className="text-sm">Pendidikan</p>
                  <button type="button" className="rounded bg-green-600 p-0.5 text-white" onClick={() => signupDataArray(false, "educations")}>
                    <IoIosArrowBack />
                  </button>
                  <button type="button" className="rounded bg-green-600 p-0.5 text-white" onClick={() => signupDataArray(true, "educations")}>
                    <IoIosArrowForward />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input label={"Institusi"} type={"text"} placeholder={"Institut Pertanian Bogor"} onchange={(e) => updateArray(indexArray.educations, e.target.value, "educations", "institution")} error={"educations.institution"} value={dataSignup.educations.length > indexArray.educations ? dataSignup.educations[indexArray.educations].institution : ""} />
                  <Input label={"Tahun"} type={"number"} placeholder={"2015"} onchange={(e) => updateArray(indexArray.educations, e.target.value, "educations", "year")} error={"educations.year"} value={dataSignup.educations.length > indexArray.educations ? dataSignup.educations[indexArray.educations].year : ""} />
                  <Input label={"Program"} type={"text"} placeholder={"Kedokteran Hewan"} onchange={(e) => updateArray(indexArray.educations, e.target.value, "educations", "program")} error={"educations.program"} value={dataSignup.educations.length > indexArray.educations ? dataSignup.educations[indexArray.educations].program : ""} />
                  <Input label={"Gelar"} type={"text"} placeholder={"S.KH"} onchange={(e) => updateArray(indexArray.educations, e.target.value, "educations", "title")} error={"educations.title"} value={dataSignup.educations.length > indexArray.educations ? dataSignup.educations[indexArray.educations].title : ""} />
                </div>
              </div>
              <div className={`${formSpecializations === "workingExperiences" ? "block" : "hidden"}`}>
                <div className="flex items-center gap-1">
                  <p className="text-sm">Pengalaman Kerja</p>
                  <button type="button" className="rounded bg-green-600 p-0.5 text-white" onClick={() => signupDataArray(false, "workingExperiences")}>
                    <IoIosArrowBack />
                  </button>
                  <button type="button" className="rounded bg-green-600 p-0.5 text-white" onClick={() => signupDataArray(true, "workingExperiences")}>
                    <IoIosArrowForward />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input label ={"Institusi"} type={"text"} placeholder={"Klinik Hewan Sehat"} onchange={(e) => updateArray(indexArray.workingExperiences, e.target.value, "workingExperiences", "institution")} error={"workingExperiences.institution"} value={dataSignup.workingExperiences.length > indexArray.workingExperiences ? dataSignup.workingExperiences[indexArray.workingExperiences].institution : ""} />
                  <Input label={"Tahun"} type={"number"} placeholder={"2020"} onchange={(e) => updateArray(indexArray.workingExperiences, e.target.value, "workingExperiences", "year")} error={"workingExperiences.year"} value={dataSignup.workingExperiences.length > indexArray.workingExperiences ? dataSignup.workingExperiences[indexArray.workingExperiences].year : ""} />
                  <Input label={"Jabatan"} type={"text"} placeholder={"Dokter Hewan"} onchange={(e) => updateArray(indexArray.workingExperiences, e.target.value, "workingExperiences", "position")} error={"workingExperiences.position"} value={dataSignup.workingExperiences.length > indexArray.workingExperiences ? dataSignup.workingExperiences[indexArray.workingExperiences].position : ""} />
                  <Input label={"Apakah masih bekerja"} type={"checkbox"} className={"aspect-square h-1/2 place-self-start"} onchange={(e) => updateArray(indexArray.workingExperiences, e.target.checked, "workingExperiences", "isActive")} error={"workingExperiences.isActive"} value={false} />
                </div>
              </div>
              <div className={`${formSpecializations === "organizationExperiences" ? "block" : "hidden"}`}>
                <div className="flex items-center gap-1">
                  <p className="text-sm">Pengalaman Organisasi Profesi</p>
                  <button type="button" className="rounded bg-green-600 p-0.5 text-white" onClick={() => signupDataArray(false, "organizationExperiences")}>
                    <IoIosArrowBack />
                  </button>
                  <button type="button" className="rounded bg-green-600 p-0.5 text-white" onClick={() => signupDataArray(true, "organizationExperiences")}>
                    <IoIosArrowForward />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input label={"Institusi"} type={"text"} placeholder={"Perhimpunan Dokter Hewan Indonesia"} onchange={(e) => updateArray(indexArray.organizationExperiences, e.target.value, "organizationExperiences", "institution")} error={"organizationExperiences.institution"} value={dataSignup.organizationExperiences.length > indexArray.organizationExperiences ? dataSignup.organizationExperiences[indexArray.organizationExperiences].institution : ""} />
                  <Input label={"Tahun"} type={"number"} placeholder={"2021"} onchange={(e) => updateArray(indexArray.organizationExperiences, e.target.value, "organizationExperiences", "year")} error={"organizationExperiences.year"} value={dataSignup.organizationExperiences.length > indexArray.organizationExperiences ? dataSignup.organizationExperiences[indexArray.organizationExperiences].year : ""} />
                  <Input label={"Jabatan"} type={"text"} placeholder={"Anggota"} onchange={(e) => updateArray(indexArray.organizationExperiences, e.target.value, "organizationExperiences", "position")} error={"organizationExperiences.position"} value={dataSignup.organizationExperiences.length > indexArray.organizationExperiences ? dataSignup.organizationExperiences[indexArray.organizationExperiences].position : ""} />
                  <Input label={"Apakah masih aktif"} type={"checkbox"} className={"aspect-square h-1/2 place-self-start"} onchange={(e) => updateArray(indexArray.organizationExperiences, e.target.checked, "organizationExperiences", "isActive")} error={"organizationExperiences.institution"} value={false} />
                </div>
              </div>
              <div className="flex gap-2">
                <button className={`${formSpecializations === "educations" ? "block" : "hidden"} w-full rounded bg-green-700 py-2 text-white`} type="button" onClick={() => checkForm(false)}>
                  Back
                </button>
                <button className={`${formSpecializations !== "educations" ? "block" : "hidden"} w-full rounded bg-green-700 py-2 text-white`} type="button" onClick={() => formSpecialization("prev")}>
                  Prev
                </button>
                <button className={`${formSpecializations !== "organizationExperiences" ? "block" : "hidden"} w-full rounded bg-green-700 py-2 text-white`} type="button" onClick={() => formSpecialization("next", formSpecializations)}>
                  Next
                </button>
                <button className={`${formSpecializations === "organizationExperiences" ? "block" : "hidden"} w-full rounded bg-green-700 py-2 text-white`} type="button" onClick={checkForm}>
                  continue
                </button>
              </div>
            </div>
          )}
          {registration === "progress4" && (
            <div>
              <Input label={"NPWP"} type={"number"} placeholder={"01.234.567.8-901.000"} onchange={(e) => setDataSignup({ ...dataSignup, bankAndTax: { ...dataSignup.bankAndTax, npwp: e.target.value } })} error={"npwp"} value={dataSignup.bankAndTax.npwp || ""} />
              <Input label={"File NPWP"} type={"file"} onchange={(e) => initiateUploadFile(e.target.files[0], "npwpFileId", "bankAndTax")} error={"npwpFileId"} />
              <div className="flex gap-2">
                <Input label={"Nama Bank"} type={"text"} placeholder={"Bank BCA"} onchange={(e) => setDataSignup({ ...dataSignup, bankAndTax: { ...dataSignup.bankAndTax, bankName: e.target.value } })} error={"bankName"} value={dataSignup.bankAndTax.bankName || ""} />
                <Input label={"Nomor Rekening"} type={"number"} placeholder={"1234567890"} onchange={(e) => setDataSignup({ ...dataSignup, bankAndTax: { ...dataSignup.bankAndTax, bankAccountNumber: e.target.value } })} error={"bankAccountNumber"} value={dataSignup.bankAndTax.bankAccountNumber || ""} />
              </div>
              <Input label={"Nama Pemilik Bank"} type={"text"} placeholder={"Hasan Ismail"} onchange={(e) => setDataSignup({ ...dataSignup, bankAndTax: { ...dataSignup.bankAndTax, bankAccountName: e.target.value } })} error={"bankAccountName"} value={dataSignup.bankAndTax.bankAccountName || ""} />
              <Input label={"Foto Rekening"} type={"file"} onchange={(e) => initiateUploadFile(e.target.files[0], "bankAccountFileId", "bankAndTax")} error={"bankAccountFileId"} />
              <div className="flex gap-2">
                <button type="button" className="w-full rounded bg-green-700 py-2 text-white" onClick={() => checkForm(false)}>
                  Back
                </button>
                <button type="submit" className="w-full rounded bg-green-700 py-2 text-white">
                  Submit
                </button>
              </div>
            </div>
          )}
        </form>
      );
    }
  } else if (type === "signin") {
    return (
      <form onSubmit={initiateSignin}>
        <div>
          <Input label={"email"} type={"email"} placeholder={"enter your email"} onchange={(e) => setDataLogin({ ...dataLogin, email: e.target.value })} />
          <Input label={"password"} type={"password"} placeholder={"enter your password"} onchange={(e) => setDataLogin({ ...dataLogin, password: e.target.value })} />
          <button type="submit" className="w-full rounded bg-green-700 py-2 text-white">
            Login
          </button>
        </div>
      </form>
    );
  }
};

export default FormRegistration;