import { useEffect, useState } from "react";
import GetAuthorization from "../../fetchAPI/GetAuthorization";
import PutAuthorization from "../../fetchAPI/PutAuthorization";
import Input from "./Input";
import Get from "../../fetchAPI/Get";
import Swal from "sweetalert2";

const GeneralIdentity = () => {
  const [data, setData] = useState(null);
  const [file, setFile] = useState({
    foto: { url: "", name: "Foto Formal Lama" },
    ktp: { url: "", name: "Foto KTP Lama" },
  });
  const [idFile, setIdFile] = useState(null);
  const [ktpFileId, setKtpFileId] = useState(null);

  const endpoint = {
    data: "/api/users/my/profile/generalIdentity",
    file: "/api/users/my/files/",
  };
  const token = JSON.parse(localStorage.getItem("token"));

  const { data: getData, loading: getLoading, error: getError, fetchData: fetchGet } = GetAuthorization(endpoint.data, token);
  const { data: putData, loading: putLoading, error: putError, fetchData: fetchPut } = PutAuthorization(endpoint.data, data, token);
  const { data: getFileData, loading: getFileLoading, error: getFileError, fetchData: fetchGetFile } = GetAuthorization(endpoint.file + idFile, token);
  const { data: getKtpFileData, loading: getKtpFileLoading, error: getKtpFileError, fetchData: fetchDataKtpFile } = GetAuthorization(endpoint.file + ktpFileId, token);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchGet();
      if (response) {
        setData(response.data);
        setIdFile(response.data.formalPictureId);
        setKtpFileId(response.data.ktpFileId);
      }
    };
    fetchData();
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
      const response = await fetch("/api/users/my/files", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const dataFile = await response.json();
        setData((prevData) => ({ ...prevData, [type]: dataFile.data.id }));

        if (type === "formalPictureId") {
          setIdFile(dataFile.data.id);
          setFile((prevFile) => ({
            ...prevFile,
            foto: { ...prevFile.foto, name: "Foto Formal Baru" },
          }));
        } else if (type === "ktpFileId") {
          setKtpFileId(dataFile.data.id);
          setFile((prevFile) => ({
            ...prevFile,
            ktp: { ...prevFile.ktp, name: "Foto KTP Baru" },
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
      console.log("update", response);

      Swal.fire({
        title: "Success!",
        text: "Data berhasil diupdate.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        setFile({
          foto: { url: "", name: "Foto Formal Lama" },
          ktp: { url: "", name: "Foto KTP Lama" },
        });

        fetchGet().then(() => {
          if (idFile) {
            fetchGetFile().then((response) => {
              if (response) {
                setFile((prevFile) => ({
                  ...prevFile,
                  foto: { ...prevFile.foto, url: response.data.httpUrl.replace(/\\/g, "") },
                }));
              }
            });
          }
          if (ktpFileId) {
            fetchDataKtpFile().then((response) => {
              if (response) {
                setFile((prevFile) => ({
                  ...prevFile,
                  ktp: { ...prevFile.ktp, url: response.data.httpUrl.replace(/\\/g, "") },
                }));
              }
            });
          }
        });
      });
    }
  };

  return (
    <form className="rounded p-6 shadow shadow-gray-300" onSubmit={updateData}>
      <h1 className="mb-4 text-lg font-semibold capitalize">Identitas Umum</h1>
      <div className="grid grid-cols-2 gap-2">
        <Input label="Gelar Depan" type="text" value={data?.frontTitle || ""} onChange={(e) => setData({ ...data, frontTitle: e.target.value })} />
        <Input label="Gelar Belakang" type="text" value={data?.backTitle || ""} onChange={(e) => setData({ ...data, backTitle: e.target.value })} />
        <Input label="Tanggal Lahir" type="date" value={data?.dateOfBirth || ""} onChange={(e) => setData({ ...data, dateOfBirth: e.target.value })} />
        <Input label="No WhatsApp" type="number" value={data?.whatsappNumber || ""} onChange={(e) => setData({ ...data, whatsappNumber: e.target.value })} />
        <Input label="NIK" type="number" value={data?.nik || ""} onChange={(e) => setData({ ...data, nik: e.target.value })} />
        <Input label="Biodata" type="text" value={data?.biodata || ""} onChange={(e) => setData({ ...data, biodata: e.target.value })} />
        <Input label="Foto Formal" type="file" value={file.foto} onChange={(e) => uploadFile(e.target.files[0], "formalPictureId")} />
        <Input label="Foto KTP" type="file" value={file.ktp} onChange={(e) => uploadFile(e.target.files[0], "ktpFileId")} />
      </div>
      <button type="submit" className="mt-4 cursor-pointer rounded bg-blue-600 px-4 py-2 text-sm text-white">
        Update Identitas
      </button>
    </form>
  );
};

export default GeneralIdentity;
