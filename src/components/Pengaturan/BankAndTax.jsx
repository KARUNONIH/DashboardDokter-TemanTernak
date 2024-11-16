import { useEffect, useState } from "react";
import GetAuthorization from "../../fetchAPI/GetAuthorization";
import PutAuthorization from "../../fetchAPI/PutAuthorization";
import Swal from 'sweetalert2';
import Input from "./Input";

const BankAndTax = () => {
  const [data, setData] = useState(null);
  const [file, setFile] = useState({
    npwp: { url: "", name: "File NPWP Lama" },
    bankAccount: { url: "", name: "File Rekening Bank Lama" },
  });
  const [npwpFileId, setNpwpFileId] = useState(null);
  const [bankAccountFileId, setBankAccountFileId] = useState(null);

  const endpoint = {
    data: "https://api.temanternak.h14.my.id/users/my/profile/bankAndTax",
    file: "https://api.temanternak.h14.my.id/users/my/files/",
  };
  const token = JSON.parse(localStorage.getItem("token"));

  const { data: getData, fetchData: fetchGet } = GetAuthorization(endpoint.data, token);
  const { fetchData: fetchPut } = PutAuthorization(endpoint.data, data, token);
  const { fetchData: fetchNpwpFile } = GetAuthorization(endpoint.file + npwpFileId, token);
  const { fetchData: fetchBankAccountFile } = GetAuthorization(endpoint.file + bankAccountFileId, token);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchGet();
      if (response) {
        setData(response.data);
        setNpwpFileId(response.data.npwpFileId);
        setBankAccountFileId(response.data.bankAccountFileId);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const getFileUrl = async (fileId, type) => {
      if (fileId) {
        const response = type === "npwp" ? await fetchNpwpFile() : await fetchBankAccountFile();
        if (response) {
          setFile((prevFile) => ({
            ...prevFile,
            [type]: { ...prevFile[type], url: response.data.httpUrl.replace(/\\/g, "") },
          }));
        }
      }
    };
    getFileUrl(npwpFileId, "npwp");
    getFileUrl(bankAccountFileId, "bankAccount");
  }, [npwpFileId, bankAccountFileId]);

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
        setData((prevData) => ({ ...prevData, [type]: dataFile.data.id }));

        if (type === "npwpFileId") {
          setNpwpFileId(dataFile.data.id);
          setFile((prevFile) => ({
            ...prevFile,
            npwp: { ...prevFile.npwp, name: "File NPWP Baru" },
          }));
        } else if (type === "bankAccountFileId") {
          setBankAccountFileId(dataFile.data.id);
          setFile((prevFile) => ({
            ...prevFile,
            bankAccount: { ...prevFile.bankAccount, name: "File Rekening Bank Baru" },
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

  const updateData = async (e) => {
    e.preventDefault();
    const response = await fetchPut();
    if (response) {
      Swal.fire({
        title: 'Success!',
        text: 'Data berhasil diupdate.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        setFile({
          npwp: { url: "", name: "File NPWP Lama" },
          bankAccount: { url: "", name: "File Rekening Bank Lama" },
        });
        fetchGet().then(() => {
          if (npwpFileId) fetchNpwpFile();
          if (bankAccountFileId) fetchBankAccountFile();
        });
      });
    }
  };

  return (
    <form className="rounded p-6 shadow shadow-gray-300" onSubmit={updateData}>
      <h1 className="mb-4 text-lg font-semibold capitalize">Bank dan Perpajakan</h1>
      <div className="grid grid-cols-2 gap-2">
        <Input label="NPWP" type="text" value={data?.npwp || ""} onChange={(e) => setData({ ...data, npwp: e.target.value })} />
        <Input label="Nama Bank" type="text" value={data?.bankName || ""} onChange={(e) => setData({ ...data, bankName: e.target.value })} />
        <Input label="Nomor Rekening Bank" type="text" value={data?.bankAccountNumber || ""} onChange={(e) => setData({ ...data, bankAccountNumber: e.target.value })} />
        <Input label="Nama Pemilik Rekening" type="text" value={data?.bankAccountName || ""} onChange={(e) => setData({ ...data, bankAccountName: e.target.value })} />
        <Input label="File NPWP" type="file" value={file.npwp} onChange={(e) => uploadFile(e.target.files[0], "npwpFileId")} />
        <Input label="File Rekening Bank" type="file" value={file.bankAccount} onChange={(e) => uploadFile(e.target.files[0], "bankAccountFileId")} />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 text-sm mt-4 rounded cursor-pointer">Update Data Bank dan Perpajakan</button>
    </form>
  );
};

export default BankAndTax;
