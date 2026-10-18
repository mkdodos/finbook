import { useState, useEffect } from "react";
import { getGames } from "../api"; // 引入純 API 函式

export const useGameOptions = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getGames().then((data) => {
      if (isMounted) {
        const gameOptions = data.map((p) => ({
          key: p.id,
          text: p.name,
          value: p.id,
        }));

        setOptions(gameOptions);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return { options, loading };
};
