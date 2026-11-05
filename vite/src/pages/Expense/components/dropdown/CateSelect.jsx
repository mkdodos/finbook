import React, { useState, useEffect } from "react";
import { getCates } from "../../data/api";
import { Dropdown, Loader } from "semantic-ui-react";

export default function CateSelect({ onChange, value }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  //   console.log(getGames());
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getCates();
        console.log(response);

        // 假設 API 回傳的資料結構為 [{ id: 1, name: "遊戲A" }, ...]
        // 需轉換成 Semantic UI Dropdown 所需的格式：{ key, value, text }
        const data = response?.map((game) => ({
          key: game.id,
          text: game.name,
          value: game.id,
        }));

        // console.log(options);

        setOptions(data);
      } catch (error) {
        console.error("載入遊戲失敗：", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Loader active inline="centered">
        載入遊戲中...
      </Loader>
    );
  }

  return (
    <Dropdown
      placeholder="選擇類別"
      fluid
      selection
      search
      clearable
      options={options}
      name="category_id"
      value={value}
      onChange={onChange}
      // onChange={handleChange}
    />
  );
}
