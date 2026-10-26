import { Table } from "semantic-ui-react";

export default function Pivot1026({ data }) {
  console.log(data);
  // 準備2組資料,分別依角色,場次群組
  const selectedGame = "茂林";

  // 過濾資料
  const filteredData = data.filter((item) => item.game_name === selectedGame);

  // 傳入資料和鍵值，傳回群組資料
  const groupedData = (targetData, key) => {
    return targetData.reduce((acc, item) => {
      const points = Number(item.points) || 0;
      const groupKey = item[key];
      acc[groupKey] ||= { data: [], total: 0 };
      acc[groupKey].data.push(item);
      acc[groupKey].total += points;
      return acc;
    }, {});
  };

  // 欄位（以 role_id 群組）與列（以 session_id 群組）
  const groupedByRole = Object.entries(groupedData(filteredData, "role_id"));
  const groupedBySession = Object.entries(
    groupedData(filteredData, "session_id"),
  );
  console.log(groupedByRole);
  console.log(groupedBySession);
  return (
    <>
      {/* 顯示表格標題(使用角色欄) */}
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>標題</Table.HeaderCell>
            {groupedByRole.map(
              ([roleId, { data: roleData, total: roleTotal }]) => {
                return (
                  <Table.HeaderCell key={roleId} textAlign="center">
                    {roleData[0]?.role_name}
                  </Table.HeaderCell>
                );
              },
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {/* 列資料(第1格),各場次 */}
          {groupedBySession.map(
            ([sessionId, { data: sessionData, total: sessionTotal }]) => {
              return (
                <Table.Row key={sessionId}>
                  <Table.Cell>{sessionData[0].play_date}</Table.Cell>
                  {/* 角色,對應場次 */}
                  {groupedByRole.map(
                    ([roleId, { data: roleData, total: roleTotal }]) => {
                      // 尋找分數
                      const matched = sessionData.find(
                        (item) => item.role_id == roleId,
                      );
                      //   const points = Number(matched.points) || 0;
                      return (
                        <Table.Cell key={roleId} textAlign="center">
                          {matched?.player_name}
                          {matched?.player_name && " / "}
                          {matched?.points}
                        </Table.Cell>
                      );
                    },
                  )}
                </Table.Row>
              );
            },
          )}
          {/* 顯示欄列對應資料 */}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell>合計</Table.HeaderCell>
            {groupedByRole.map(
              ([roleId, { data: roleData, total: roleTotal }]) => {
                return (
                  <Table.HeaderCell key={roleId} textAlign="center">
                    {/* 合計 */}
                    <div style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                      {roleTotal}
                    </div>

                    {/* 平均：小字、灰色、帶有說明 */}
                    <div style={{ fontSize: "0.9em", color: "#666" }}>
                      平均 : {Math.round(roleTotal / roleData.length)}
                    </div>
                  </Table.HeaderCell>
                );
              },
            )}
          </Table.Row>
        </Table.Footer>
      </Table>
    </>
  );
}
