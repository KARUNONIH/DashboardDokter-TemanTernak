// Post.js
import { useAtom } from "jotai";
import { loadingApiAtom, responseApiAtom, errorApiAtom } from "../atoms/Atom";

const FilePostAuthorization = (url, body, token) => {
  const [data, setData] = useAtom(responseApiAtom);
  const [loading, setLoading] = useAtom(loadingApiAtom);
  const [error, setError] = useAtom(errorApiAtom);
  
  const fetchData = async () => {
    try {
        const formData = new FormData();
        formData.append("document_type", body.document_type);
        formData.append("file", body.file);
        console.log(formData.get("document_type"));
        console.log(formData.get("file"));
      setData(null);
      setError(null);
      setLoading(true);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": `multipart/form-data`,
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.errors || "An error occurred");
        console.error(result.errors);
        return;
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
};

export default FilePostAuthorization;

//   console.log("Field 'document_type' exists:", body.has("document_type"));
// if (body.has("document_type")) {
//   console.log("Value of 'document_type':", body.get("document_type"));
// }

// console.log("Field 'file' exists:", body.has("file"));
// if (body.has("file")) {
//   console.log("Value of 'file':", body.get("file"));
// }
