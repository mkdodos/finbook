import { Card, Icon, List } from "semantic-ui-react";

export default function PivotTemplate({ data }) {
  // 接收資料
  console.log(data);
  data = data.filter((item) => item.game_name == "茂林");
  // 欄位鍵值(player_id)
  const colkey = "player_id";
  const rowkey = "play_date";
  // 將資料依鍵值群組
  const columnGroups = Object.groupBy(data, (item) => item[colkey]);
  const rowGroups = Object.groupBy(data, (item) => item[rowkey]);
  console.log(columnGroups);
  // 取得群組二維陣列 : [鍵值,資料]
  const columnArray = Object.entries(columnGroups);
  const rowArray = Object.entries(rowGroups);
  console.log(rowArray);

  const card = (gId, gData, header) => {
    return (
      <Card key={gId} color="green">
        <Card.Content>
          <Card.Header>
            {/* {gId} */}
            {header}
          </Card.Header>
        </Card.Content>
        <Card.Content>{list(gData)}</Card.Content>
      </Card>
    );
  };

  const list = (gData) => (
    <List>
      {gData.map((item) => (
        <List.Item key={item.scorecard_id}>
          <List.Content>
            {item.player_name}
            {item.role_name}
            {item.points}
          </List.Content>
        </List.Item>
      ))}
    </List>
  );

  return (
    <div>
      {/* 群組資料(玩家) */}
      {columnArray.map(([gId, gData]) => {
        const header = gData[0].player_name;
        return card(gId, gData, header);
      })}
      {/*  群組資料(日期) */}
      {rowArray.map(([gId, gData]) => {
        const header = gId;
        return card(gId, gData, header);
      })}
    </div>
  );
}
