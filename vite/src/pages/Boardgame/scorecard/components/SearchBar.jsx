import React, { useState } from "react";
import { Button, Input, Form } from "semantic-ui-react";
import PlayerSelect from "../../components/dropdown/PlayerSelect";

export default function SearchBar({ fetchData }) {
  // 搜尋值
  const [search, setSearch] = useState({
    role_name: "",
    game_name: "",
    play_date: "",
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
  return (
    <div>
      <Form>
        <Form.Group widths={3}>
          <Form.Field>
            <Input
              type="date"
              value={search.play_date}
              onChange={handleChange}
              name="play_date"
            />
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
            <PlayerSelect onChange={handlePlayerChange} />
          </Form.Field>

          <Form.Field>
            <Button onClick={handleSearch}>查詢</Button>
          </Form.Field>
        </Form.Group>
      </Form>
    </div>
  );
}
