// Post.js
import { useAtom } from "jotai";
import { loadingApiAtom, responseApiAtom, errorApiAtom } from "../atoms/Atom";

const Post = (url, body) => {
  const [data, setData] = useAtom(responseApiAtom);
  const [loading, setLoading] = useAtom(loadingApiAtom);
  const [error, setError] = useAtom(errorApiAtom);

  const fetchData = async () => {
    try {
      setData(null);
      setError(null);
      setLoading(true);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
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

export default Post;
