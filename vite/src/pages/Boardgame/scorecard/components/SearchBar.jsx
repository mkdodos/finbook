import React, { useState } from "react";
import { Button, Input, Form } from "semantic-ui-react";
import PlayerSelect from "../../components/dropdown/PlayerSelect";
import SessionSelect from "../../components/dropdown/SessionSelect";

export default function SearchBar({ fetchData }) {
  // 搜尋值
  const [search, setSearch] = useState({
    role_name: "",
    game_name: "",
    play_date: "",
    player_count: "",
  });
  const handleChange = (e) => {
    setSearch((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // setSearch(e.target.value);
  };
  const handleSearch = () => {
    console.log(search);
    fetchData(search);
  };
  const handlePlayerChange = (e, { value }) => {
    // value : player_id
    setSearch((prev) => ({ ...prev, player_id: value }));
    console.log(value);
  };

  const handleDropdownChange = (e, { name, value }) => {
    setSearch((prev) => ({ ...prev, [name]: value }));
    console.log(value);
  };

  return (
    <div>
      <Form>
        <Form.Group>
          {/* 場次 */}
          <Form.Field width={3}>
            <SessionSelect onChange={handleDropdownChange} />
          </Form.Field>
          <Form.Field>
            <Input
              placeholder="遊戲名稱"
              value={search.game_name}
              onChange={handleChange}
              name="game_name"
            />
          </Form.Field>
          <Form.Field>
            <Input
              placeholder="角色名稱"
              value={search.role_name}
              onChange={handleChange}
              name="role_name"
            />
          </Form.Field>

          <Form.Field>
            <Input
              placeholder="人數"
              value={search.player_count}
              onChange={handleChange}
              name="player_count"
            />
          </Form.Field>

          <Form.Field width={2}>
            <PlayerSelect onChange={handleDropdownChange} />
          </Form.Field>

          <Form.Field>
            <Button onClick={handleSearch}>查詢</Button>
          </Form.Field>
        </Form.Group>
      </Form>
    </div>
  );
}
