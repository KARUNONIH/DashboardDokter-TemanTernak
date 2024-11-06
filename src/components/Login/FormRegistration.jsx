import Input from "./Input";
import { useAtom } from "jotai";
import { activeFormRegistrationAtom, formSpecializationAtom, sessionSignAtom, signupStatusAtom, errorSignupAtom } from "../../atoms/Atom";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const FormRegistration = ({ type, signin, signup, preSignup }) => {
  const [registration, registrationProggres] = useAtom(activeFormRegistrationAtom);
  const [sessionSign, setsessionSign] = useAtom(sessionSignAtom);
  const [formSpecializations, setformSpecializations] = useAtom(formSpecializationAtom);
  const [signupStatus, setSignupStatus] = useAtom(signupStatusAtom);
  const [errorSignup, setErrorSignup] = useAtom(errorSignupAtom);
  const navigate = useNavigate();

  useEffect(() => {
    registrationProggres("proggress0");
  }, []);

  const checkForm = (event) => {
    event.preventDefault();
    // cek form logic
    const statusRegistration = {
      proggress0: "proggress1",
      proggress1: "proggress2",
      proggress2: "proggress3",
      proggress3: "proggress4",
      proggress4: "proggress5",
      proggress5: "finish",
    };
    registrationProggres(statusRegistration[registration]);
  };

  const formSpecialization = (action) => {
    const typeSpecialization = ["pendidikan", "kerja", "organisasi"];
    const index = typeSpecialization.indexOf(formSpecializations);

    setformSpecializations(action === "prev" ? typeSpecialization[index - 1] : typeSpecialization[index + 1]);
  };

  const iniciateSignin = (e) => {
    e.preventDefault();
    signin();
  }

  const iniciateSignup = (e) => {
    e.preventDefault();
    console.log("sdfa");
    signup();
  }

  const iniciatePreSignup = (e) => {
    e.preventDefault();
    preSignup();
  }
  return (
    <>
      <div className={`${type === "signup" ? "block" : "hidden"}`}>
       <form className={`${registration === "proggress0" ? "block" : "hidden"}`} onSubmit={iniciatePreSignup}>
        <div className="">
          <Input label={"name"} type={"text"} placeholder={"enter your name"} />
          <Input label={"email"} type={"email"} placeholder={"enter your email"} />
          <Input label={"password"} type={"password"} placeholder={"enter your password"} />
          <button type="submit" className="w-full rounded bg-green-700 py-2 text-white">
            Create Account
          </button>
        </div>
        <p className={`text-center mt-6 text-sm capitalize`}>
          Already Have an Account ? <Link to={"/signin"} className="underline text-blue-600">sign in</Link>
        </p>
        </form>
    </div>
      <form className={`${type === "signup" ? "block" : "hidden"}`} onSubmit={iniciateSignup}>
        <div className={`${registration === "proggress1" ? "block" : "hidden"}`} >
          <div className="flex gap-2">
            <Input label={"Gelar Depan"} type={"text"} placeholder={"Dr."} />
            <Input label={"Gelar Belakang"} type={"text"} placeholder={"M.Kes"} />
          </div>
          <div className="flex gap-2">
            <Input label={"No Whatsapp"} type={"tel"} placeholder={"081234567890"} />
            <Input label={"NIK"} type={"number"} placeholder={"3276030101010001"} />
          </div>
          <Input label={"Tanggal Lahir"} type={"date"} />
          <Input label={"Foto Formal"} type={"file"} placeholder={"Unggah foto formal"} accept="image/*" />
          <Input label={"KTP"} type={"file"} placeholder={"Unggah scan KTP"} accept />
          <button type="button" className="w-full rounded bg-green-700 py-2 text-white" onClick={checkForm}>
            continue
          </button>
        </div>
        <div className={`${registration === "proggress2" ? "block" : "hidden"}`}>
          <Input label={"STRV (Surat Tanda Registrasi Veteriner)"} type={"file"} placeholder={"Unggah file STRV"} />
          <div className="flex gap-2">
            <Input label={"No STRV"} type={"text"} placeholder={"STRV123456789"} />
            <Input label={"Masa Berlaku STRV"} type={"date"} />
          </div>
          <Input label={"SIP (Surat Izin Praktik)"} type={"file"} placeholder={"Unggah file SIP"} />
          <div className="flex gap-2">
            <Input label={"No SIP"} type={"text"} placeholder={"SIP987654321"} />
            <Input label={"Masa Berlaku SIP"} type={"date"} />
          </div>
          <button type="button" className="w-full rounded bg-green-700 py-2 text-white" onClick={checkForm}>
            continue
          </button>
        </div>
        <div className={`${registration === "proggress3" ? "block" : "hidden"}`}>
          <Input label={"Spesialisasi"} type={"text"} placeholder={"Bedah, Penyakit Dalam"} />
          <div className={`${formSpecializations === "pendidikan" ? "block" : "hidden"}`}>
            <p className="text-sm">Pendidikan</p>
            <div className="grid grid-cols-2 gap-2">
              <Input label={"Institusi"} type={"text"} placeholder={"Institut Pertanian Bogor"} />
              <Input label={"Tahun"} type={"number"} placeholder={"2015"} />
              <Input label={"Program"} type={"text"} placeholder={"Kedokteran Hewan"} />
              <Input label={"Gelar"} type={"text"} placeholder={"S.KH"} />
            </div>
          </div>
          <div className={`${formSpecializations === "kerja" ? "block" : "hidden"}`}>
            <p className="text-sm">Pengalaman Kerja</p>
            <div className="grid grid-cols-2 gap-2">
              <Input label={"Institusi"} type={"text"} placeholder={"Klinik Hewan Sehat"} />
              <Input label={"Tahun"} type={"number"} placeholder={"2020"} />
              <Input label={"Jabatan"} type={"text"} placeholder={"Dokter Hewan"} />
              <Input label={"Apakah masih bekerja"} type={"checkbox"} className={"aspect-square h-1/2 place-self-start"} />
            </div>
          </div>
          <div className={`${formSpecializations === "organisasi" ? "block" : "hidden"}`}>
            <p className="text-sm">Pengalaman Organisasi Profesi</p>
            <div className="grid grid-cols-2 gap-2">
              <Input label={"Institusi"} type={"text"} placeholder={"Perhimpunan Dokter Hewan Indonesia"} />
              <Input label={"Tahun"} type={"number"} placeholder={"2021"} />
              <Input label={"Jabatan"} type={"text"} placeholder={"Anggota"} />
              <Input label={"Apakah masih aktif"} type={"checkbox"} className={"aspect-square h-1/2 place-self-start"} />
            </div>
          </div>
          <div className="flex gap-2">
            <button className={`${formSpecializations !== "pendidikan" ? "block" : "hidden"} w-full rounded bg-green-700 py-2 text-white`} type="button" onClick={() => formSpecialization("prev")}>
              Prev
            </button>
            <button className={`${formSpecializations !== "organisasi" ? "block" : "hidden"} w-full rounded bg-green-700 py-2 text-white`} type="button" onClick={() => formSpecialization("next")}>
              Next
            </button>
            <button className={`${formSpecializations === "organisasi" ? "block" : "hidden"} w-full rounded bg-green-700 py-2 text-white`} type="button" onClick={checkForm}>
              continue
            </button>
          </div>
        </div>
        <div className={`${registration === "proggress4" ? "block" : "hidden"}`}>
          <Input label={"NPWP"} type={"number"} placeholder={"01.234.567.8-901.000"} />
          <Input label={"File NPWP"} type={"file"} placeholder={"Unggah file NPWP"} />
          <Input label={"Nama Bank"} type={"text"} placeholder={"Bank BCA"} />
          <Input label={"Nomor Rekening"} type={"number"} placeholder={"1234567890"} />
          <Input label={"Foto Rekening"} type={"file"} placeholder={"Unggah foto buku rekening"} />
          <button type="submit" className="w-full rounded bg-green-700 py-2 text-white">
            Submit
          </button>
        </div>
      </form>
      <div className={`${registration === "proggress5" && type === "signup" ? "block" : "hidden"}`}>
        {signupStatus ?
          <div className="">
          <p>Anda sudah terdaftar silahkan login</p>
            <button type="button" className="w-full rounded bg-green-700 py-2 text-white">
            <Link to={"/dashboard"} className="block">
            Login
          </Link>
          </button>
        </div>
          :
          <div className="">
            <p>Berkas anda sedang di verifikasi</p>
            <p>{ errorSignup }</p>
          </div>
          
        }
        </div>
      <form className={`${type === "signin" ? "block" : "hidden"}`} onSubmit={iniciateSignin}>
        <div className="">
          <Input label={"email"} type={"email"} placeholder={"enter your email"} />
          <Input label={"password"} type={"password"} placeholder={"enter your password"} />
          <button type="submit" className="w-full rounded bg-green-700 py-2 text-white">
            Login
          </button>
        </div>
      </form>
    </>
  );
};

export default FormRegistration;
