import { useEffect, useState } from "react";
import GetAuthorization from "../../fetchAPI/GetAuthorization";
import PutAuthorization from "../../fetchAPI/PutAuthorization";
import Swal from "sweetalert2";

const OrganizationExperience = () => {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newExperience, setNewExperience] = useState({
    institution: "",
    year: "",
    position: "",
    isActive: false,
  });

  const endpoint = "https://api-temanternak.test.h14.my.id/users/my/profile/organizationExperiences";
  const token = JSON.parse(localStorage.getItem("token"));

  const { data: getData, loading: getLoading, error: getError, fetchData: fetchGet } = GetAuthorization(endpoint, token);
  const { data: putData, loading: putLoading, error: putError, fetchData: fetchPut } = PutAuthorization(endpoint, { organizationExperiences: data }, token);

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
        text: "Organization experiences updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        setIsEditing(false);
      });
    }
  };

  const handleAddExperience = () => {
    if (newExperience.institution && newExperience.year && newExperience.position) {
      setData([...data, newExperience]);
      setNewExperience({ institution: "", year: "", position: "", isActive: false });
    }
  };

  const handleRemoveExperience = (index) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };

  return (
    <div className="rounded p-6 shadow shadow-gray-300">
      <h1 className="mb-4 text-lg font-semibold capitalize">Pengalaman Organisasi</h1>

      {getLoading ? (
        <p>Loading...</p>
      ) : getError ? (
        <p>Error: {getError}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {data.map((experience, index) => (
            <div key={index} className="flex flex-col gap-2 rounded border border-gray-300 p-4">
              {isEditing ? (
                <>
                  <label>Institution</label>
                  <input
                    type="text"
                    value={experience.institution}
                    onChange={(e) => {
                      const updatedData = [...data];
                      updatedData[index].institution = e.target.value;
                      setData(updatedData);
                    }}
                    className="w-full rounded border border-gray-300 px-2 py-1"
                  />
                  <label>Year</label>
                  <input
                    type="number"
                    value={experience.year}
                    onChange={(e) => {
                      const updatedData = [...data];
                      updatedData[index].year = e.target.value;
                      setData(updatedData);
                    }}
                    className="w-full rounded border border-gray-300 px-2 py-1"
                  />
                  <label>Position</label>
                  <input
                    type="text"
                    value={experience.position}
                    onChange={(e) => {
                      const updatedData = [...data];
                      updatedData[index].position = e.target.value;
                      setData(updatedData);
                    }}
                    className="w-full rounded border border-gray-300 px-2 py-1"
                  />
                  <div className="flex items-center gap-2">
                    <label>Active</label>
                    <input
                      type="checkbox"
                      checked={experience.isActive}
                      onChange={(e) => {
                        const updatedData = [...data];
                        updatedData[index].isActive = e.target.checked;
                        setData(updatedData);
                      }}
                    />
                  </div>
                  <button onClick={() => handleRemoveExperience(index)} className="mt-2 rounded bg-red-100 px-2 py-1 text-red-600">
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <label>Institution</label>
                  <input
                    type="text"
                    value={experience.institution}
                    onChange={(e) => {
                      const updatedData = [...data];
                      updatedData[index].institution = e.target.value;
                      setData(updatedData);
                    }}
                    className="w-full rounded border border-gray-300 px-2 py-1"
                    readOnly
                  />
                  <label>Year</label>
                  <input
                    type="number"
                    value={experience.year}
                    onChange={(e) => {
                      const updatedData = [...data];
                      updatedData[index].year = e.target.value;
                      setData(updatedData);
                    }}
                    className="w-full rounded border border-gray-300 px-2 py-1"
                    readOnly
                  />
                  <label>Position</label>
                  <input
                    type="text"
                    value={experience.position}
                    onChange={(e) => {
                      const updatedData = [...data];
                      updatedData[index].position = e.target.value;
                      setData(updatedData);
                    }}
                    className="w-full rounded border border-gray-300 px-2 py-1"
                    readOnly
                  />
                  <div className="flex items-center gap-2">
                    <label>Active</label>
                    <input
                      type="checkbox"
                      checked={experience.isActive}
                      onChange={(e) => {
                        const updatedData = [...data];
                        updatedData[index].isActive = e.target.checked;
                        setData(updatedData);
                      }}
                      disabled
                    />
                  </div>
                </>
              )}
            </div>
          ))}

          {isEditing && (
            <div className="flex flex-col gap-2 rounded border border-gray-300 p-4">
              <label>Institution</label>
              <input type="text" value={newExperience.institution} onChange={(e) => setNewExperience({ ...newExperience, institution: e.target.value })} placeholder="Add institution" className="w-full rounded border border-gray-300 px-2 py-1" />
              <label>Year</label>
              <input type="number" value={newExperience.year} onChange={(e) => setNewExperience({ ...newExperience, year: e.target.value })} placeholder="Add year" className="w-full rounded border border-gray-300 px-2 py-1" />
              <label>Position</label>
              <input type="text" value={newExperience.position} onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })} placeholder="Add position" className="w-full rounded border border-gray-300 px-2 py-1" />
              <div className="flex items-center gap-2">
                <label>Active</label>
                <input type="checkbox" checked={newExperience.isActive} onChange={(e) => setNewExperience({ ...newExperience, isActive: e.target.checked })} />
              </div>
              <button onClick={handleAddExperience} className="mt-2 rounded bg-blue-100 px-2 py-1 text-blue-600">
                Add
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-4">
        {isEditing ? (
          <button onClick={handleSave} className="rounded bg-blue-600 px-4 py-2 text-white">
            Update Pengalaman Organisasi
          </button>
        ) : (
          <button onClick={handleEdit} className="rounded bg-gray-600 px-4 py-2 text-white">
            Edit Pengalaman Organisasi
          </button>
        )}
      </div>
    </div>
  );
};

export default OrganizationExperience;
