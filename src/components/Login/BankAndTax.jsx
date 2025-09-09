import { useEffect, useState } from "react";
import GetAuthorization from "../../fetchAPI/GetAuthorization";
import InputRegistration from "./InputRegistration";
import { activeFormRegistrationAtom, formSpecializationAtom, newDataSignupAtom, statusRegistationAtom } from "../../atoms/Atom";
import { useAtom } from "jotai";

const BankAndTax = ({ submit }) => {
  const [isContinue, setIsContinue] = useState(false);
  const [data, setData] = useState(null);
  const [file, setFile] = useState({
    npwp: { url: "", name: "" },
    bank: { url: "", name: "" },
  });
  const [npwpFileId, setNpwpFileId] = useState(null);
  const [bankAccountFileId, setBankAccountFileId] = useState(null);
  const [statusRegistration, setStatusRegistration] = useAtom(statusRegistationAtom);
  const [errors, setErrors] = useState({});
  const [dataRegistration, setDataRegistration] = useAtom(newDataSignupAtom);
  const [isCheckAction, setIsCheckAction] = useState(false);
  const [registration, registrationProggres] = useAtom(activeFormRegistrationAtom);
  const [formSpecializations, setformSpecializations] = useAtom(formSpecializationAtom);
  const [isSubmit, setIsSubmit] = useState(false);

  const endpoint = {
    file: "http://api-temanternak.test.h14.my.id/users/my/files/",
  };
  const token = JSON.parse(localStorage.getItem("token"));

  const { fetchData: fetchGetNpwpFile } = GetAuthorization(endpoint.file + npwpFileId, token);
  const { fetchData: fetchGetBankFile } = GetAuthorization(endpoint.file + bankAccountFileId, token);

  const dataRegis = JSON.parse(localStorage.getItem("data"));

  useEffect(() => {
    if (dataRegis?.bankAndTax) {
      setData(dataRegis?.bankAndTax);
    }
  }, []);

  useEffect(() => {
    if (data) {
      setNpwpFileId(data.npwpFileId);
      setBankAccountFileId(data.bankAccountFileId);
    }
  }, [data]);

  useEffect(() => {
    if (dataRegis?.bankAndTax) {
      setFile((prevFile) => ({
        ...prevFile,
        npwp: {
          ...prevFile.npwp,
          name: "NPWP File",
        },
        bank: {
          ...prevFile.bank,
          name: "Bank File",
        },
      }));
    }
  }, []);

  useEffect(() => {
    const getNpwpFileUrl = async () => {
      if (npwpFileId) {
        const response = await fetchGetNpwpFile();
        if (response) {
          setFile((prevFile) => ({
            ...prevFile,
            npwp: { ...prevFile.npwp, url: response.data.httpUrl.replace(/\\/g, "") },
          }));
        }
      }
    };
    getNpwpFileUrl();
  }, [npwpFileId]);

  useEffect(() => {
    const getBankFileUrl = async () => {
      if (bankAccountFileId) {
        const response = await fetchGetBankFile();
        if (response) {
          setFile((prevFile) => ({
            ...prevFile,
            bank: { ...prevFile.bank, url: response.data.httpUrl.replace(/\\/g, "") },
          }));
        }
      }
    };
    getBankFileUrl();
  }, [bankAccountFileId]);

  const uploadFile = async (file, type) => {
    const formData = new FormData();
    formData.append("document_type", type);
    formData.append("file", file);

    try {
      const response = await fetch("http://api-temanternak.test.h14.my.id/users/my/files", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const dataFile = await response.json();
        setData((prevData) => ({ ...prevData, [type]: dataFile.data.id }));

        if (type === "npwpFileId") {
          setNpwpFileId(dataFile.data.id);
          setFile((prevFile) => ({
            ...prevFile,
            npwp: { ...prevFile.npwp, name: "NPWP File" },
          }));
        } else if (type === "bankAccountFileId") {
          setBankAccountFileId(dataFile.data.id);
          setFile((prevFile) => ({
            ...prevFile,
            bank: { ...prevFile.bank, name: "Bank File" },
          }));
        }
      } else {
        alert("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!data?.npwp) newErrors.npwp = "NPWP wajib diisi.";
    if (!data?.bankName) newErrors.bankName = "Nama Bank wajib diisi.";
    if (!data?.bankAccountNumber) newErrors.bankAccountNumber = "Nomor Rekening wajib diisi.";
    if (!data?.bankAccountName) newErrors.bankAccountName = "Nama Pemilik Rekening wajib diisi.";
    if (!data?.npwpFileId) newErrors.npwpFileId = "File NPWP wajib diunggah.";
    if (!data?.bankAccountFileId) newErrors.bankAccountFileId = "File Rekening wajib diunggah.";

    setErrors(newErrors);

    return Object.keys(newErrors).length;
  };

  useEffect(() => {
    if (isCheckAction) {
      validate();
    }
  }, [data]);

  const checkAction = (type) => {
    if (type) {
      const checkError = validate();

      if (checkError === 0) {
        setDataRegistration((prev) => ({
          ...prev,
          bankAndTax: data,
        }));
        console.log("Valid, processing...");
        setIsContinue(true); // Trigger submission
      } else {
        console.warn("Validation error, check your input!");
        setIsCheckAction(true); // Indicate error for user feedback
      }
    } else {
      setIsContinue(true); // Proceed without validation
      registrationProggres("proggress3");
      setformSpecializations("organizationExperiences");
    }
  };

  useEffect(() => {
    if (isContinue) {
      // Simulate submit process
      localStorage.setItem("data", JSON.stringify(dataRegistration));
      console.log("Submit process completed");
      submit(); // Call the actual submission function

      // Reset state
      setIsContinue(false);
    }
  }, [isContinue]);

  return (
    <div className="px-6">
      <div className="grid grid-cols-2 gap-2">
        <InputRegistration label="NPWP" type="text" value={data?.npwp || ""} onChange={(e) => setData({ ...data, npwp: e.target.value })} error={errors.npwp} placeholder="123456789012345" />
        <InputRegistration label="Nama Bank" type="text" value={data?.bankName || ""} onChange={(e) => setData({ ...data, bankName: e.target.value })} error={errors.bankName} placeholder="National Bank" />
        <InputRegistration label="Nomor Rekening" type="text" value={data?.bankAccountNumber || ""} onChange={(e) => setData({ ...data, bankAccountNumber: e.target.value })} error={errors.bankAccountNumber} placeholder="1234567890" />
        <InputRegistration label="Nama Pemilik Rekening" type="text" value={data?.bankAccountName || ""} onChange={(e) => setData({ ...data, bankAccountName: e.target.value })} error={errors.bankAccountName} placeholder="John Doe" />
        <InputRegistration label="File NPWP" type="file" value={file.npwp} onChange={(e) => uploadFile(e.target.files[0], "npwpFileId")} error={errors.npwpFileId} />
        <InputRegistration label="File Rekening Bank" type="file" value={file.bank} onChange={(e) => uploadFile(e.target.files[0], "bankAccountFileId")} error={errors.bankAccountFileId} />
      </div>
      <div className="flex items-center gap-2">
        <button type="button" className="mt-4 w-1/2 cursor-pointer rounded bg-blue-600 px-4 py-2 text-sm text-white" onClick={() => checkAction(false)}>
          Back
        </button>
        <button type="button" className="mt-4 w-1/2 cursor-pointer rounded bg-blue-600 px-4 py-2 text-sm text-white" onClick={() => checkAction(true)}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default BankAndTax;
