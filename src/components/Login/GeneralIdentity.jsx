import { useEffect, useState } from "react";
import GetAuthorization from "../../fetchAPI/GetAuthorization";
import PutAuthorization from "../../fetchAPI/PutAuthorization";
import Get from "../../fetchAPI/Get";
import Swal from "sweetalert2";
import InputRegistration from "./InputRegistration";
import { activeFormRegistrationAtom, newDataSignupAtom, statusRegistationAtom } from "../../atoms/Atom";
import { useAtom } from "jotai";

const GeneralIdentity = () => {
  const [isContinue, setIsContinue] = useState(false);
  const [data, setData] = useState({});
  const [file, setFile] = useState({
    foto: { url: "", name: "" },
    ktp: { url: "", name: "" },
  });
  const [idFile, setIdFile] = useState(null);
  const [ktpFileId, setKtpFileId] = useState(null);
  const [errors, setErrors] = useState({});
  const [dataRegistration, setDataRegistration] = useAtom(newDataSignupAtom);
  const [isCheckAction, setIsCheckAction] = useState(false);
  const [registration, registrationProggres] = useAtom(activeFormRegistrationAtom);

  const dataRegis = JSON.parse(localStorage.getItem("data"));

  const endpoint = {
    file: "https://api.temanternak.h14.my.id/users/my/files/",
  };
  const token = JSON.parse(localStorage.getItem("token"));


  const { data: getFileData, loading: getFileLoading, error: getFileError, fetchData: fetchGetFile } = GetAuthorization(endpoint.file + idFile, token);
  const { data: getKtpFileData, loading: getKtpFileLoading, error: getKtpFileError, fetchData: fetchDataKtpFile } = GetAuthorization(endpoint.file + ktpFileId, token);


  useEffect(() => {
    console.log("before",dataRegis);
    if (dataRegis?.generalIdentity) {
      setData((prev) => ({
        ...prev,
        ...dataRegis.generalIdentity,
      }));
    }
  }, []);

  useEffect(() => {
    if (dataRegis?.generalIdentity) {
      console.log("file");
        setIdFile(dataRegis.generalIdentity.formalPictureId);
        setKtpFileId(dataRegis.generalIdentity.ktpFileId);
    }
  }, []);

  useEffect(() => {
    console.log(idFile, ktpFileId);
    console.log(dataRegis?.generalIdentity?.formalPictureId, dataRegis?.generalIdentity?.ktpFileId);
  }, [])

  useEffect(() => {
    if (dataRegis?.generalIdentity) {
      setFile((prevFile) => ({
        ...prevFile,
        foto: {
          ...prevFile.foto,
          name: "Foto Formal",
        },
        ktp: {
          ...prevFile.ktp,
          name: "Foto KTP",
        },
      }));
    } else if (dataRegis?.generalIdentity) {
      setFile((prevFile) => ({
        ...prevFile,
        foto: {
          ...prevFile.foto,
          name: "Foto Formal Lama",
        },
        ktp: {
          ...prevFile.ktp,
          name: "Foto KTP Lama",
        },
      }));
    }
  }, []);

  useEffect(() => {
    const getFileUrl = async () => {
      if (idFile) {
        const response = await fetchGetFile();
        if (response) {
          setFile((prevFile) => ({
            ...prevFile,
            foto: { ...prevFile.foto, url: response.data.httpUrl.replace(/\\/g, "") },
          }));
        }
      }
    };
    getFileUrl();
  }, [idFile]);

  useEffect(() => {
    const getKtpFileUrl = async () => {
      if (ktpFileId) {
        const response = await fetchDataKtpFile();
        if (response) {
          setFile((prevFile) => ({
            ...prevFile,
            ktp: { ...prevFile.ktp, url: response.data.httpUrl.replace(/\\/g, "") },
          }));
        }
      }
    };
    getKtpFileUrl();
  }, [ktpFileId]);

  const uploadFile = async (file, type) => {
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
        console.log(response);
        const dataFile = await response.json();
        setData((prevData) => ({ ...prevData, [type]: dataFile.data.id }));

        if (type === "formalPictureId") {
          setIdFile(dataFile.data.id);
          const text = dataRegis?.generalIdentity ? "Foto Formal Baru" : "Foto Formal";
          setFile((prevFile) => ({
            ...prevFile,
            foto: { ...prevFile.foto, name: text },
          }));
        } else if (type === "ktpFileId") {
          setKtpFileId(dataFile.data.id);
          const text = dataRegis?.generalIdentity ? "Foto KTP Baru" : "Foto KTP";
          setFile((prevFile) => ({
            ...prevFile,
            ktp: { ...prevFile.ktp, name: text },
          }));
        }

        const fileResponse = await fetch(endpoint.file + dataFile.data.id, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (fileResponse.ok) {
          const fileData = await fileResponse.json();
          if (type === "formalPictureId") {
            setFile((prevFile) => ({
              ...prevFile,
              foto: { ...prevFile.foto, url: fileData.data.httpUrl.replace(/\\/g, "") },
            }));
          } else if (type === "ktpFileId") {
            setFile((prevFile) => ({
              ...prevFile,
              ktp: { ...prevFile.ktp, url: fileData.data.httpUrl.replace(/\\/g, "") },
            }));
          }
        }
      } else {
        // alert("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!data?.frontTitle) newErrors.frontTitle = "Gelar Depan wajib diisi.";
    if (!data?.backTitle) newErrors.backTitle = "Gelar Belakang wajib diisi.";
    if (!data?.dateOfBirth) newErrors.dateOfBirth = "Tanggal Lahir wajib diisi.";
    if (!data?.whatsappNumber) newErrors.whatsappNumber = "No WhatsApp wajib diisi.";
    if (!data?.nik) newErrors.nik = "NIK wajib diisi.";
    if (!data?.biodata) newErrors.biodata = "Biodata wajib diisi.";
    if (!data?.formalPictureId) newErrors.formalPictureId = "Foto Formal wajib diunggah.";
    if (!data?.ktpFileId) newErrors.ktpFileId = "Foto KTP wajib diunggah.";

    setErrors(newErrors);

    return Object.keys(newErrors).length;
  };

  useEffect(() => {
    if (isCheckAction) {
      validate();
    }
  }, [data]);

  const checkAction = (condition) => {
    const checkError = validate();

    if (checkError === 0) {
      console.log("continue",dataRegis);
      setDataRegistration((prev) => ({
        ...prev,
        generalIdentity: data,
      }));
      setIsContinue(true);
    } else {
      setIsCheckAction(true);
    }
  };
  
  useEffect(() => {
    if (isContinue) {
      console.log(data);
      localStorage.setItem("data", JSON.stringify(dataRegistration));
      registrationProggres("proggress2");
      setIsContinue(false);
    }
  }, [isContinue]);


  return (
    <div className="px-6">
      <div className="grid grid-cols-2 gap-2">
        <InputRegistration label="Gelar Depan" type="text" value={data?.frontTitle || ""} onChange={(e) => setData({ ...data, frontTitle: e.target.value })} error={errors.frontTitle} placeholder={"S.K.H."} />
        <InputRegistration label="Gelar Belakang" type="text" value={data?.backTitle || ""} onChange={(e) => setData({ ...data, backTitle: e.target.value })} error={errors.backTitle} placeholder={"Drh"} />
        <InputRegistration label="Tanggal Lahir" type="date" value={data?.dateOfBirth || ""} onChange={(e) => setData({ ...data, dateOfBirth: e.target.value })} error={errors.dateOfBirth} />
        <InputRegistration label="No WhatsApp" type="number" value={data?.whatsappNumber || ""} onChange={(e) => setData({ ...data, whatsappNumber: e.target.value })} error={errors.whatsappNumber} placeholder={"08384729837492"} />
        <InputRegistration label="NIK" type="number" value={data?.nik || ""} onChange={(e) => setData({ ...data, nik: e.target.value })} error={errors.nik} placeholder={"32138788347"} />
        <InputRegistration label="Biodata" type="text" value={data?.biodata || ""} onChange={(e) => setData({ ...data, biodata: e.target.value })} error={errors.biodata} placeholder={"Saya ahli dibidang ..."} />
        <InputRegistration label="Foto Formal" type="file" value={file.foto} onChange={(e) => uploadFile(e.target.files[0], "formalPictureId")} error={errors.formalPictureId} />
        <InputRegistration label="Foto KTP" type="file" value={file.ktp} onChange={(e) => uploadFile(e.target.files[0], "ktpFileId")} error={errors.ktpFileId} />
      </div>
      <button type="button" className="mt-4 cursor-pointer rounded bg-blue-600 px-4 py-2 text-sm text-white w-1/2" onClick={() => checkAction(true)}>
        Continue
      </button>
    </div>
  );
};

export default GeneralIdentity;
