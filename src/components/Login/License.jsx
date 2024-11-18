import { useEffect, useState } from "react";
import GetAuthorization from "../../fetchAPI/GetAuthorization";
import { useAtom } from "jotai";
import InputRegistration from "./InputRegistration";
import { activeFormRegistrationAtom, newDataSignupAtom, statusRegistationAtom } from "../../atoms/Atom";

const License = () => {
  const [data, setData] = useState(null);
  const [file, setFile] = useState({
    strv: { url: "", name: "" },
    sip: { url: "", name: "" },
  });
  const [strvFileId, setStrvFileId] = useState(null);
  const [sipFileId, setSipFileId] = useState(null);
  const [statusRegistration, setStatusRegistration] = useAtom(statusRegistationAtom);
  const [dataRegistration, setDataRegistration] = useAtom(newDataSignupAtom);
  const [errors, setErrors] = useState({});
  const [isCheckAction, setIsCheckAction] = useState(false);
  const [registration, registrationProggres] = useAtom(activeFormRegistrationAtom);

  const endpoint = {
    file: "https://api.temanternak.h14.my.id/users/my/files/",
  };
  const token = JSON.parse(localStorage.getItem("token"));

  const { fetchData: fetchGetStrvFile } = GetAuthorization(endpoint.file + strvFileId, token);
  const { fetchData: fetchGetSipFile } = GetAuthorization(endpoint.file + sipFileId, token);

  useEffect(() => {
    if (!statusRegistration && dataRegistration.license) {
      setData(dataRegistration.license);
    }
  }, [dataRegistration.license]);

  useEffect(() => {
    if (data) {
      setStrvFileId(data.strvFileId);
      setSipFileId(data.sipFileId);
    }
  }, [data]);

  useEffect(() => {
    const fetchFileUrl = async (fileId, type) => {
      if (fileId) {
        const response = type === "strv" ? await fetchGetStrvFile() : await fetchGetSipFile();
        if (response) {
          setFile((prevFile) => ({
            ...prevFile,
            [type]: {
              ...prevFile[type],
              url: response.data.httpUrl.replace(/\\/g, ""),
              name: type === "strv" ? "STRV Document" : "SIP Document",
            },
          }));
        }
      }
    };

    fetchFileUrl(strvFileId, "strv");
    fetchFileUrl(sipFileId, "sip");
  }, [strvFileId, sipFileId]);

  const uploadFile = async (file, type) => {
    const formData = new FormData();
    formData.append("document_type", type);
    formData.append("file", file);

    try {
      const response = await fetch("https://api.temanternak.h14.my.id/users/my/files", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const dataFile = await response.json();
        const fileId = dataFile.data.id;
        setData((prevData) => ({ ...prevData, [type]: fileId }));


        if (type === "strvFileId") {
          setStrvFileId(fileId);
        } else if (type === "sipFileId") {
          setSipFileId(fileId);
        }

        setFile((prevFile) => ({
          ...prevFile,
          [type === "strvFileId" ? "strv" : "sip"]: {
            ...prevFile[type === "strvFileId" ? "strv" : "sip"],
            url: dataFile.data.httpUrl.replace(/\\/g, ""),
          },
        }));
      }
    } catch (error) {
      console.error("File upload error:", error);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!data?.strvNumber) newErrors.strvNumber = "Nomor STRV wajib diisi.";
    if (!data?.strvValidUntil) newErrors.strvValidUntil = "Tanggal berlaku STRV wajib diisi.";
    if (!data?.strvFileId) newErrors.strvFileId = "File STRV wajib diunggah.";
    if (!data?.sipNumber) newErrors.sipNumber = "Nomor SIP wajib diisi.";
    if (!data?.sipValidUntil) newErrors.sipValidUntil = "Tanggal berlaku SIP wajib diisi.";
    if (!data?.sipFileId) newErrors.sipFileId = "File SIP wajib diunggah.";

    setErrors(newErrors);
    return Object.keys(newErrors).length;
  };

  useEffect(() => {
    if (isCheckAction) {
      validate();
    }
  }, [data]);

  const checkAction = (type) => {
    if (!type) {
      registrationProggres("proggress1");
    } else {
      const errorsCount = validate();
      if (errorsCount === 0) {
        setDataRegistration((prev) => ({
          ...prev,
          license: data,
        }));
        registrationProggres("proggress3");
      } else {
        setIsCheckAction(true);
      }
    }
  };

  useEffect(() => {
    console.log(dataRegistration)
  }, [dataRegistration]);

  return (
    <div className="px-6">
      <div className="grid grid-cols-2 gap-2">
        <InputRegistration label="Nomor STRV" type="text" value={data?.strvNumber || ""} onChange={(e) => setData({ ...data, strvNumber: e.target.value })} error={errors.strvNumber} placeholder={"STRV123456"} />
        <InputRegistration label="Tanggal Berlaku STRV" type="date" value={data?.strvValidUntil || ""} onChange={(e) => setData({ ...data, strvValidUntil: e.target.value })} error={errors.strvValidUntil} />
        <InputRegistration label="Nomor SIP" type="text" value={data?.sipNumber || ""} onChange={(e) => setData({ ...data, sipNumber: e.target.value })} error={errors.sipNumber} placeholder={"SIP123456"} />
        <InputRegistration label="Tanggal Berlaku SIP" type="date" value={data?.sipValidUntil || ""} onChange={(e) => setData({ ...data, sipValidUntil: e.target.value })} error={errors.sipValidUntil} />
        <InputRegistration label="File STRV" type="file" value={file.strv} onChange={(e) => uploadFile(e.target.files[0], "strvFileId")} error={errors.strvFileId} />
        <InputRegistration label="File SIP" type="file" value={file.sip} onChange={(e) => uploadFile(e.target.files[0], "sipFileId")} error={errors.sipFileId} />
      </div>
      <div className="flex gap-2">
        <button type="button" className="mt-4 flex-1 cursor-pointer rounded bg-blue-600 px-4 py-2 text-sm text-white" onClick={() => checkAction(false)}>
          Back
        </button>
        <button type="button" className="mt-4 flex-1 cursor-pointer rounded bg-blue-600 px-4 py-2 text-sm text-white" onClick={() => checkAction(true)}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default License;
