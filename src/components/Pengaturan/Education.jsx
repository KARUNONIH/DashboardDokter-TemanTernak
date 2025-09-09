import { useEffect, useState } from "react";
import GetAuthorization from "../../fetchAPI/GetAuthorization";
import PutAuthorization from "../../fetchAPI/PutAuthorization";
import Swal from "sweetalert2";

const Education = () => {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newEducation, setNewEducation] = useState({
    institution: "",
    year: "",
    program: "",
    title: "",
  });

  const endpoint = "http://api-temanternak.test.h14.my.id/users/my/profile/educations";
  const token = JSON.parse(localStorage.getItem("token"));

  const { data: getData, loading: getLoading, error: getError, fetchData: fetchGet } = GetAuthorization(endpoint, token);
  const { data: putData, loading: putLoading, error: putError, fetchData: fetchPut } = PutAuthorization(endpoint, { educations: data }, token);

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
        text: "Educations updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        setIsEditing(false);
      });
    }
  };

  const handleAddEducation = () => {
    if (newEducation.institution.trim()) {
      setData([...data, newEducation]);
      setNewEducation({ institution: "", year: "", program: "", title: "" });
    }
  };

  const handleRemoveEducation = (index) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };

  return (
    <div className="rounded p-6 shadow shadow-gray-300">
      <h1 className="mb-4 text-lg font-semibold capitalize">Pendidikan</h1>

      {getLoading ? (
        <p>Loading...</p>
      ) : getError ? (
        <p>Error: {getError}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {data.map((education, index) => (
            <div key={index} className="rounded-lg border p-4">
              {isEditing ? (
                <div className="grid gap-2">
                  <label className="block text-sm font-medium text-gray-700">Institution</label>
                  <input
                    type="text"
                    value={education.institution}
                    onChange={(e) => {
                      const updatedData = [...data];
                      updatedData[index].institution = e.target.value;
                      setData(updatedData);
                    }}
                    placeholder="Institution"
                    className="w-full rounded border border-gray-300 px-2 py-1"
                  />

                  <label className="block text-sm font-medium text-gray-700">Year</label>
                  <input
                    type="number"
                    value={education.year}
                    onChange={(e) => {
                      const updatedData = [...data];
                      updatedData[index].year = e.target.value;
                      setData(updatedData);
                    }}
                    placeholder="Year"
                    className="w-full rounded border border-gray-300 px-2 py-1"
                  />

                  <label className="block text-sm font-medium text-gray-700">Program</label>
                  <input
                    type="text"
                    value={education.program}
                    onChange={(e) => {
                      const updatedData = [...data];
                      updatedData[index].program = e.target.value;
                      setData(updatedData);
                    }}
                    placeholder="Program"
                    className="w-full rounded border border-gray-300 px-2 py-1"
                  />

                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={education.title}
                    onChange={(e) => {
                      const updatedData = [...data];
                      updatedData[index].title = e.target.value;
                      setData(updatedData);
                    }}
                    placeholder="Title"
                    className="w-full rounded border border-gray-300 px-2 py-1"
                  />
                </div>
              ) : (
                <div className="grid gap-2">
                  <label className="block text-sm font-medium text-gray-700">Institution</label>
                  <input
                    type="text"
                    value={education.institution}
                    onChange={(e) => {
                      const updatedData = [...data];
                      updatedData[index].institution = e.target.value;
                      setData(updatedData);
                    }}
                    placeholder="Institution"
                    className="w-full rounded border border-gray-300 px-2 py-1"
                    readOnly
                  />

                  <label className="block text-sm font-medium text-gray-700">Year</label>
                  <input
                    type="number"
                    value={education.year}
                    onChange={(e) => {
                      const updatedData = [...data];
                      updatedData[index].year = e.target.value;
                      setData(updatedData);
                    }}
                    placeholder="Year"
                    className="w-full rounded border border-gray-300 px-2 py-1"
                    readOnly
                  />

                  <label className="block text-sm font-medium text-gray-700">Program</label>
                  <input
                    type="text"
                    value={education.program}
                    onChange={(e) => {
                      const updatedData = [...data];
                      updatedData[index].program = e.target.value;
                      setData(updatedData);
                    }}
                    placeholder="Program"
                    className="w-full rounded border border-gray-300 px-2 py-1"
                    readOnly
                  />

                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={education.title}
                    onChange={(e) => {
                      const updatedData = [...data];
                      updatedData[index].title = e.target.value;
                      setData(updatedData);
                    }}
                    placeholder="Title"
                    className="w-full rounded border border-gray-300 px-2 py-1"
                    readOnly
                  />
                </div>
              )}
              {isEditing && (
                <div className="mt-2 flex gap-2">
                  <button onClick={() => handleRemoveEducation(index)} className="rounded bg-red-100 px-2 py-1 text-red-600">
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}

          {isEditing && (
            <div className="rounded-lg border p-4">
              <label className="block text-sm font-medium text-gray-700">Institution</label>
              <input type="text" value={newEducation.institution} onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })} placeholder="Institution" className="mb-2 w-full rounded border border-gray-300 px-2 py-1" />

              <label className="block text-sm font-medium text-gray-700">Year</label>
              <input type="number" value={newEducation.year} onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })} placeholder="Year" className="mb-2 w-full rounded border border-gray-300 px-2 py-1" />

              <label className="block text-sm font-medium text-gray-700">Program</label>
              <input type="text" value={newEducation.program} onChange={(e) => setNewEducation({ ...newEducation, program: e.target.value })} placeholder="Program" className="mb-2 w-full rounded border border-gray-300 px-2 py-1" />

              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" value={newEducation.title} onChange={(e) => setNewEducation({ ...newEducation, title: e.target.value })} placeholder="Title" className="w-full rounded border border-gray-300 px-2 py-1" />
              <button onClick={handleAddEducation} className="mt-2 rounded bg-blue-100 px-2 py-1 text-blue-600">
                Add
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-4">
        {isEditing ? (
          <button onClick={handleSave} className="rounded bg-blue-600 px-4 py-2 text-white">
            Update Pendidikan
          </button>
        ) : (
          <button onClick={handleEdit} className="rounded bg-gray-600 px-4 py-2 text-white">
            Edit Pendidikan
          </button>
        )}
      </div>
    </div>
  );
};

export default Education;
