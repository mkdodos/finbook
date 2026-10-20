import { useState, useEffect } from "react";
import { getRoles } from "../api"; // 引入純 API 函式

export const useRoleOptions = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getRoles().then((data) => {
      if (isMounted) {
        const roleOptions = data.map((p) => ({
          key: p.id,
          text: p.name,
          value: p.id,
        }));

        setOptions(roleOptions);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return { options, loading };
};
