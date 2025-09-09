import { useEffect, useState } from "react";
import GetAuthorization from "../../fetchAPI/GetAuthorization";
import PutAuthorization from "../../fetchAPI/PutAuthorization";
import Swal from "sweetalert2";

const Specialization = () => {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newSpecialization, setNewSpecialization] = useState("");

  const endpoint = "http://api-temanternak.test.h14.my.id/users/my/profile/specializations";
  const token = JSON.parse(localStorage.getItem("token"));

  const { data: getData, loading: getLoading, error: getError, fetchData: fetchGet } = GetAuthorization(endpoint, token);
  const { data: putData, loading: putLoading, error: putError, fetchData: fetchPut } = PutAuthorization(endpoint, { specializations: data }, token);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchGet();
      if (response) {
        setData(response.data);
      }
    };
    fetchData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const response = await fetchPut();
    if (response) {
      Swal.fire({
        title: "Success!",
        text: "Specializations updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        setIsEditing(false);
      });
    }
  };

  const handleAddSpecialization = () => {
    if (newSpecialization.trim()) {
      setData([...data, newSpecialization]);
      setNewSpecialization("");
    }
  };

  const handleRemoveSpecialization = (index) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };

  return (
    <div className="rounded p-6 shadow shadow-gray-300">
      <h1 className="mb-4 text-lg font-semibold capitalize">Spesialisasi</h1>

      {getLoading ? (
        <p>Loading...</p>
      ) : getError ? (
        <p>Error: {getError}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {data.map((specialization, index) => (
            <div key={index} className="flex items-center gap-2">
              {isEditing ? (
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => {
                    const updatedData = [...data];
                    updatedData[index] = e.target.value;
                    setData(updatedData);
                  }}
                  className="w-full rounded border border-gray-300 px-2 py-1"
                />
              ) : (
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => {
                    const updatedData = [...data];
                    updatedData[index] = e.target.value;
                    setData(updatedData);
                  }}
                  className="w-full rounded border border-gray-300 px-2 py-1"
                  readOnly
                />
              )}
              {isEditing && (
                <div className="flex gap-2">
                  <button onClick={() => handleRemoveSpecialization(index)} className="rounded bg-red-100 px-2 py-1 text-red-600">
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}

          {isEditing && (
            <div className="flex items-center gap-2">
              <input type="text" value={newSpecialization} onChange={(e) => setNewSpecialization(e.target.value)} placeholder="Add new specialization" className="w-full rounded border border-gray-300 px-2 py-1" />
              <button onClick={handleAddSpecialization} className="rounded bg-blue-100 px-2 py-1 text-blue-600">
                Add
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-4">
        {isEditing ? (
          <button onClick={handleSave} className="rounded bg-blue-600 px-4 py-2 text-white">
            Update Spesialisasi
          </button>
        ) : (
          <button onClick={handleEdit} className="rounded bg-gray-600 px-4 py-2 text-white">
            Edit Spesialisasi
          </button>
        )}
      </div>
    </div>
  );
};

export default Specialization;
