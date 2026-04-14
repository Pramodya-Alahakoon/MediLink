import { useCallback, useEffect, useState } from "react";

export const useAsyncData = (fetcher, deps = []) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const run = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetcher();
      setData(response);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong while loading data.");
    } finally {
      setIsLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    run();
  }, [run]);

  return { data, isLoading, error, refetch: run, setData };
};
