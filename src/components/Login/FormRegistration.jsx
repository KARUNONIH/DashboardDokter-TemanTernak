import Input from "./Input";
import { useAtom } from "jotai";
import { activeFormRegistrationAtom, formSpecializationAtom, sessionSignAtom, signupStatusAtom, errorApiAtom, preSignupAtom, loginAtom, signupAtom, errorSignupAtom, fileNameSignupAtom, errorSignuSpecializationAtom, newDataSignupAtom, errorLoginAtom } from "../../atoms/Atom";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PostAuthorization from "../../fetchAPI/PostAuthorization";
import FilePostAuthorization from "../../fetchAPI/FilePostAuthorization";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import GeneralIdentity from "./GeneralIdentity";
import License from "./License";
import Education from "./Education";
import WorkingExperience from "./WorkingExperience";
import OrganizationExperience from "./OrganizationExperience";
import Specialization from "./Specialization";
import BankAndTax from "./BankAndTax";

const FormRegistration = ({ type, signin, signup, preSignup }) => {
  const [registration, registrationProggres] = useAtom(activeFormRegistrationAtom);
  const [sessionSign, setsessionSign] = useAtom(sessionSignAtom);
  const [formSpecializations, setformSpecializations] = useAtom(formSpecializationAtom);
  const [signupStatus, setSignupStatus] = useAtom(signupStatusAtom);
  const [errorSignup, setErrorSignup] = useAtom(errorApiAtom);
  const [dataPreSignup, setDataPreSignup] = useAtom(preSignupAtom);
  const [dataLogin, setDataLogin] = useAtom(loginAtom);
  const [dataSignup, setDataSignup] = useAtom(signupAtom);
  const [errors, setErrors] = useAtom(errorSignupAtom);
  const [errorsSpecialization, setErrorsSpecialization] = useAtom(errorSignuSpecializationAtom);
  const [indexArray, setIndexArray] = useState({ specializations: 0, educations: 0, workingExperiences: 0, organizationExperiences: 0 });
  const [fileName, setFileName] = useAtom(fileNameSignupAtom);
  const [dataRegistration, setDataRegistration] = useAtom(newDataSignupAtom);
  const [errorLogin, setErrorLogin] = useAtom(errorLoginAtom);



  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token") && registration !== "proggress5") {
      registrationProggres("proggress1");
      setformSpecializations("specializations");
    } else {
      registrationProggres("proggress0");
    }
  }, []);

  // useEffect(() => {
  //   if (type === "signin") {
  //     registrationProggres("proggress1");
  //   }
  // }, [type]);

  // const validatePart = (part) => {
  //   const newErrors = {};
  //   if (part === "proggress1") {
  //     if (!dataSignup.generalIdentity.frontTitle) newErrors.frontTitle = "Gelar depan dibutuhkan";
  //     if (!dataSignup.generalIdentity.backTitle) newErrors.backTitle = "Gelar belakang dibutuhkan";
  //     if (!dataSignup.generalIdentity.dateOfBirth) newErrors.dateOfBirth = "Tanggal lahir dibutuhkan";
  //     if (!dataSignup.generalIdentity.whatsappNumber) newErrors.whatsappNumber = "No whatsapp dibutuhkan";
  //     if (!dataSignup.generalIdentity.formalPictureId) newErrors.formalPictureId = "Foto formal dibutuhkan";
  //     if (!dataSignup.generalIdentity.nik) newErrors.nik = "NIK dibutuhkan";
  //     if (!dataSignup.generalIdentity.ktpFileId) newErrors.ktpFileId = "KTP dibutuhkan";
  //     if (!dataSignup.generalIdentity.biodata) newErrors.biodata = "Biodata dibutuhkan";
  //   } else if (part === "proggress2") {
  //     if (!dataSignup.license.strvFileId) newErrors.strvFileId = "File STRV dibutuhkan";
  //     if (!dataSignup.license.strvValidUntil) newErrors.strvValidUntil = "No STRV dibutuhkan";
  //     if (!dataSignup.license.strvNumber) newErrors.strvNumber = "Masa Berlaku STRV dibutuhkan";
  //     if (!dataSignup.license.sipFileId) newErrors.sipFileId = "File SIP dibutuhkan";
  //     if (!dataSignup.license.sipValidUntil) newErrors.sipValidUntil = "No SIP dibutuhkan";
  //     if (!dataSignup.license.sipNumber) newErrors.sipNumber = "Masa Berlaku SIP dibutuhkan";
  //   } else if (part === "proggress4") {
  //     if (!dataSignup.bankAndTax.npwp) newErrors.npwp = "NPWP dibutuhkan";
  //     if (!dataSignup.bankAndTax.npwpFileId) newErrors.npwpFileId = "File NPWP dibutuhkan";
  //     if (!dataSignup.bankAndTax.bankName) newErrors.bankName = "Nama Bank dibutuhkan";
  //     if (!dataSignup.bankAndTax.bankAccountNumber) newErrors.bankAccountNumber = "Nomor rekening dibutuhkan";
  //     if (!dataSignup.bankAndTax.bankAccountName) newErrors.bankAccountName = "Nama pemilik bank dibutuhkan";
  //     if (!dataSignup.bankAndTax.bankAccountFileId) newErrors.bankAccountFileId = "Foto Rekening dibutuhkan";
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // useEffect(() => {
  //   validatePart(registration);
  //   if (dataSignup.specializations) {
  //     setErrorsSpecialization(null);
  //   }
  // }, [dataSignup]);

  const iniciateSignin = (e) => {
    e.preventDefault();
    signin();
  };

  const iniciateSignup = (e) => {
    e.preventDefault();
    signup();
    // if (validatePart(registration)) {
    // }
  };

  const iniciatePreSignup = (e) => {
    e.preventDefault();
    preSignup();
  };


  
  if (registration === "proggress5" && type === "signin") {
    return (
      <div className="">
        {signupStatus ? (
          <div className="">
            <p>Anda sudah terdaftar silahkan login</p>
            <button type="button" className="w-full rounded bg-green-700 py-2 text-white">
              <Link to={"/dashboard"} className="block">
                Login
              </Link>
            </button>
          </div>
        ) : (
          <div className="">
              <p className="text-center">Berkas anda sedang di verifikasi</p>
              <button type="button" onClick={() => registrationProggres("proggress1")}>Lihat Dokumen Anda</button>
          </div>
        )}
      </div>
    );
  } else if (type === "signup") {
    if (registration === "proggress0") {
      return (
        <form className="" onSubmit={iniciatePreSignup}>
          <div className="">
            <Input label={"name"} type={"text"} placeholder={"enter your name"} onchange={(e) => setDataPreSignup({ ...dataPreSignup, name: e.target.value })} value={dataPreSignup?.name || ""}/>
            <Input label={"email"} type={"email"} placeholder={"enter your email"} onchange={(e) => setDataPreSignup({ ...dataPreSignup, email: e.target.value })} value={dataPreSignup?.email || ""} />
          <p className="text-xs text-red-600 -mt-2 mb-2">{JSON.stringify(errorSignup?.email?.[0])}</p>
            <Input label={"password"} type={"password"} placeholder={"enter your password"} onchange={(e) => setDataPreSignup({ ...dataPreSignup, password: e.target.value })} value={dataPreSignup?.password || ""}/>
            <button type="submit" className="w-full rounded bg-green-700 py-2 text-white">
              Create Account
            </button>
          </div>
          <p className={`mt-6 text-center text-sm capitalize`}>
            Already Have an Account ?{" "}
            <Link to={`/signin?invitationId=${JSON.parse(localStorage.getItem("token"))}`} className="text-blue-600 underline">
              sign in
            </Link>
          </p>
        </form>
      );
    } else if (registration !== "proggress0") {
      return (
        <form className="" onSubmit={iniciateSignup} encType="multipart/form-data">
          {registration === "proggress1" && <GeneralIdentity />}
          {registration === "proggress2" && <License />}
          {registration === "proggress3" && (
            <div className="">
              {formSpecializations === "specializations" && <Specialization/>}
              {formSpecializations === "educations" && <Education/>}
              {formSpecializations === "workingExperiences" && <WorkingExperience/>}
              {formSpecializations === "organizationExperiences" && <OrganizationExperience/>}
            </div>
          )}
          {registration === "proggress4" && <BankAndTax submit={ signup }/>}
        </form>
      );
    }
  } else if (type === "signin") {
    return (
      <form className="" onSubmit={iniciateSignin}>
        <div className="">
          <Input label={"email"} type={"email"} placeholder={"enter your email"} onchange={(e) => setDataLogin({ ...dataLogin, email: e.target.value })} value={dataLogin?.email || ""} />
          <p className="text-xs text-red-600 -mt-2 mb-2">{JSON.stringify(errorLogin?.message)}</p>
          <Input label={"password"} type={"password"} placeholder={"enter your password"} onchange={(e) => setDataLogin({ ...dataLogin, password: e.target.value })} value={dataLogin?.password || ""}/>
          <button type="submit" className="w-full rounded bg-green-700 py-2 text-white">
            Login
          </button>
        </div>
      </form>
    );
  }
};

export default FormRegistration;
