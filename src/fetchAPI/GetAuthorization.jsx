import { useAtom } from "jotai";
import { loadingApiAtom, responseApiAtom, errorApiAtom } from "../atoms/Atom";

const GetAuthorization = (url, token) => {
  const [data, setData] = useAtom(responseApiAtom);
  const [loading, setLoading] = useAtom(loadingApiAtom);
  const [error, setError] = useAtom(errorApiAtom);

  const fetchData = async () => {
      
    try {
      setData(null);
      setError(null);
      setLoading(true);
      const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.errors || "An error occurred");
        return;
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
};

export default GetAuthorization;
