import { useEffect, useState } from "react";
import GetAuthorization from "../../fetchAPI/GetAuthorization";
import PutAuthorization from "../../fetchAPI/PutAuthorization";
import Input from "./Input";
import Get from "../../fetchAPI/Get";
import Swal from "sweetalert2";

const License = () => {
  const [data, setData] = useState(null);
  const [file, setFile] = useState({
    strv: { url: "", name: "STRV Lama" },
    sip: { url: "", name: "SIP Lama" },
  });
  const [strvFileId, setStrvFileId] = useState(null);
  const [sipFileId, setSipFileId] = useState(null);

  const endpoint = {
    data: "http://api-temanternak.test.h14.my.id/users/my/profile/license",
    file: "http://api-temanternak.test.h14.my.id/users/my/files/",
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

        if (type === "strvFileId") {
          setStrvFileId(dataFile.data.id);
          setFile((prevFile) => ({
            ...prevFile,
            strv: { ...prevFile.strv, name: "STRV Baru" },
          }));
        } else if (type === "sipFileId") {
          setSipFileId(dataFile.data.id);
          setFile((prevFile) => ({
            ...prevFile,
            sip: { ...prevFile.sip, name: "SIP Baru" },
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

      Swal.fire({
        title: "Success!",
        text: "Data berhasil diupdate.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        setFile({
          strv: { url: "", name: "STRV Lama" },
          sip: { url: "", name: "SIP Lama" },
        });

        fetchGet().then(() => {
          if (strvFileId) {
            fetchGetFile().then((response) => {
              if (response) {
                setFile((prevFile) => ({
                  ...prevFile,
                  strv: { ...prevFile.strv, url: response.data.httpUrl.replace(/\\/g, "") },
                }));
              }
            });
          }
          if (sipFileId) {
            fetchDataSipFile().then((response) => {
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
      <button type="submit" className="mt-4 cursor-pointer rounded bg-blue-600 px-4 py-2 text-sm text-white">
        Update Perizinan
      </button>
    </form>
  );
};

export default License;
