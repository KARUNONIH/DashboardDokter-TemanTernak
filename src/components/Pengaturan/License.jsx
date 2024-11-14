import { useEffect, useState } from "react";
import GetAuthorization from "../../fetchAPI/GetAuthorization";
import PutAuthorization from "../../fetchAPI/PutAuthorization";
import Input from "./input";
import Get from "../../fetchAPI/Get";
import Swal from 'sweetalert2';

const License = () => {
  const [data, setData] = useState(null);
  const [file, setFile] = useState({
    strv: { url: "", name: "STRV Lama" },
    sip: { url: "", name: "SIP Lama" },
  });
  const [strvFileId, setStrvFileId] = useState(null);
  const [sipFileId, setSipFileId] = useState(null);

  const endpoint = {
    data: "https://api.temanternak.h14.my.id/users/my/profile/license",
    file: "https://api.temanternak.h14.my.id/users/my/files/",
  };
  const token = JSON.parse(localStorage.getItem("token"));

  const { data: getData, loading: getLoading, error: getError, fetchData: fetchGet } = GetAuthorization(endpoint.data, token);
  const { data: putData, loading: putLoading, error: putError, fetchData: fetchPut } = PutAuthorization(endpoint.data, data, token);
  const { data: getFileData, loading: getFileLoading, error: getFileError, fetchData: fetchGetFile } = GetAuthorization(endpoint.file + strvFileId, token);
  const { data: getSipFileData, loading: getSipFileLoading, error: getSipFileError, fetchData: fetchDataSipFile } = GetAuthorization(endpoint.file + sipFileId, token);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchGet();
      if (response) {
        setData(response.data);
        setStrvFileId(response.data.strvFileId);
        setSipFileId(response.data.sipFileId);
      }
    };
    fetchData();
  }, []);

  // useEffect untuk mengambil URL STRV saat strvFileId berubah
  useEffect(() => {
    const getFileUrl = async () => {
      if (strvFileId) {
        const response = await fetchGetFile();
        if (response) {
          setFile((prevFile) => ({
            ...prevFile,
            strv: { ...prevFile.strv, url: response.data.httpUrl.replace(/\\/g, "") },
          }));
        }
      }
    };
    getFileUrl();
  }, [strvFileId]);

  // useEffect untuk mengambil URL SIP saat sipFileId berubah
  useEffect(() => {
    const getSipFileUrl = async () => {
      if (sipFileId) {
        const response = await fetchDataSipFile();
        if (response) {
          setFile((prevFile) => ({
            ...prevFile,
            sip: { ...prevFile.sip, url: response.data.httpUrl.replace(/\\/g, "") },
          }));
        }
      }
    };
    getSipFileUrl();
  }, [sipFileId]);

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
        const dataFile = await response.json();
        setData((prevData) => ({ ...prevData, [type]: dataFile.data.id }));

        // Update state strvFileId atau sipFileId berdasarkan tipe file
        if (type === "strvFileId") {
          setStrvFileId(dataFile.data.id);
          setFile((prevFile) => ({
            ...prevFile,
            strv: { ...prevFile.strv, name: "STRV Baru" }, // Ubah nama STRV menjadi STRV Baru
          }));
        } else if (type === "sipFileId") {
          setSipFileId(dataFile.data.id);
          setFile((prevFile) => ({
            ...prevFile,
            sip: { ...prevFile.sip, name: "SIP Baru" }, // Ubah nama SIP menjadi SIP Baru
          }));
        }

        // Ambil URL terbaru setelah upload file
        const fileResponse = await fetch(endpoint.file + dataFile.data.id, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (fileResponse.ok) {
          const fileData = await fileResponse.json();
          // Update URL file berdasarkan tipe
          if (type === "strvFileId") {
            setFile((prevFile) => ({
              ...prevFile,
              strv: { ...prevFile.strv, url: fileData.data.httpUrl.replace(/\\/g, "") },
            }));
          } else if (type === "sipFileId") {
            setFile((prevFile) => ({
              ...prevFile,
              sip: { ...prevFile.sip, url: fileData.data.httpUrl.replace(/\\/g, "") },
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

      // Tampilkan SweetAlert setelah update berhasil
      Swal.fire({
        title: 'Success!',
        text: 'Data berhasil diupdate.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        // Reset file names ke nama lama setelah update
        setFile({
          strv: { url: "", name: "STRV Lama" },
          sip: { url: "", name: "SIP Lama" },
        });

        // Ambil data terbaru setelah SweetAlert
        fetchGet().then(() => {
          // Ambil URL terbaru setelah data di-fetch
          if (strvFileId) {
            fetchGetFile().then(response => {
              if (response) {
                setFile((prevFile) => ({
                  ...prevFile,
                  strv: { ...prevFile.strv, url: response.data.httpUrl.replace(/\\/g, "") },
                }));
              }
            });
          }
          if (sipFileId) {
            fetchDataSipFile().then(response => {
              if (response) {
                setFile((prevFile) => ({
                  ...prevFile,
                  sip: { ...prevFile.sip, url: response.data.httpUrl.replace(/\\/g, "") },
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
      <h1 className="mb-4 text-lg font-semibold capitalize">Perizinan</h1>
      <div className="grid grid-cols-2 gap-2">
        <Input label="Nomor STRV" type="text" value={data?.strvNumber || ""} onChange={(e) => setData({ ...data, strvNumber: e.target.value })} />
        <Input label="Tanggal Kadaluarsa STRV" type="date" value={data?.strvValidUntil || ""} onChange={(e) => setData({ ...data, strvValidUntil: e.target.value })} />
        <Input label="Nomor SIP" type="text" value={data?.sipNumber || ""} onChange={(e) => setData({ ...data, sipNumber: e.target.value })} />
        <Input label="Tanggal Kadaluarsa SIP" type="date" value={data?.sipValidUntil || ""} onChange={(e) => setData({ ...data, sipValidUntil: e.target.value })} />
        <Input label="STRV File" type="file" value={file.strv} onChange={(e) => uploadFile(e.target.files[0], "strvFileId")} />
        <Input label="SIP File" type="file" value={file.sip} onChange={(e) => uploadFile(e.target.files[0], "sipFileId")} />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 text-sm mt-4 rounded cursor-pointer">Update Perizinan</button>
    </form>
  );
};

export default License;
