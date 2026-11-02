import React, { useState, useEffect } from "react";
import { getPlayers } from "../../api";
import { Dropdown, Loader } from "semantic-ui-react";

export default function PlayerSelect({ onChange, value }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getPlayers();

        // 假設 API 回傳的資料結構為 [{ id: 1, name: "遊戲A" }, ...]
        // 需轉換成 Semantic UI Dropdown 所需的格式：{ key, value, text }
        const data = response?.map((item) => ({
          key: item.id,
          text: item.name,
          value: item.id,
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
        載入中...
      </Loader>
    );
  }

  return (
    <Dropdown
      name="player_id"
      placeholder="選擇玩家"
      fluid
      selection
      search
      clearable
      options={options}
      value={value}
      onChange={onChange}
    />

    // <Dropdown
    //   placeholder="選擇玩家"
    //   name="player_id"
    //   fluid
    //   selection
    //   search
    //   clearable
    //   options={options}
    //   value={value}
    //   onChange={onChange}
    // />
  );
}
