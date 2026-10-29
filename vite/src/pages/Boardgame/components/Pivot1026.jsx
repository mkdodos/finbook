import { Table } from "semantic-ui-react";

export default function Pivot1026({ data }) {
  console.log(data);
  // 準備2組資料,分別依角色,場次群組
  const selectedGame = "茂林";

  // 過濾資料
  const filteredData = data.filter((item) => item.game_name === selectedGame);

  // 將過濾後的資料，直接依 points 由大到小排序
  // const filteredData = data
  //   .filter((item) => item.game_name === selectedGame)
  //   .sort((a, b) => (Number(b.points) || 0) - (Number(a.points) || 0));

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
  // const groupedByRole = Object.entries(groupedData(filteredData, "role_id"));
  const groupedByRole = Object.entries(
    groupedData(filteredData, "role_id"),
  ).sort((a, b) => b[1].total - a[1].total);

  const groupedBySession = Object.entries(
    groupedData(filteredData, "session_id"),
  ).sort((a, b) => {
    // 依日期排序
    return new Date(b[1].data[0].play_date) - new Date(a[1].data[0].play_date);
  });

  const groupedByPlayer = Object.entries(
    groupedData(filteredData, "player_id"),
  );

  // console.log(groupedByRole);
  // console.log(groupedBySession);
  return (
    <>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>玩家/角色</Table.HeaderCell>
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
          {/* 列資料(第1格),各玩家 */}
          {groupedByPlayer.map(
            ([playerId, { data: playerData, total: playerTotal }]) => {
              return (
                <Table.Row key={playerId}>
                  <Table.Cell>{playerData[0].player_name}</Table.Cell>
                  {/* 角色,對應場次 */}
                  {groupedByRole.map(
                    ([roleId, { data: roleData, total: roleTotal }]) => {
                      // 尋找分數
                      const matched = playerData.filter(
                        (item) => item.role_id == roleId,
                      );
                      // 計算個人角色總分
                      const groupSum = matched.reduce((acc, item) => {
                        return acc + Number(item.points);
                      }, 0);
                      //   const points = Number(matched.points) || 0;
                      return (
                        <Table.Cell key={roleId} textAlign="center">
                          {/* {matched[0]?.points}
                          {matched[1] && " + "}
                          {matched[1]?.points}
                          {matched[2] && " + "}
                          {matched[2]?.points} = {groupSum} */}
                          {matched.length > 0 &&
                            Math.round(groupSum / matched.length)}
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
            <Table.HeaderCell>平均</Table.HeaderCell>
            {groupedByRole.map(
              ([roleId, { data: roleData, total: roleTotal }]) => {
                return (
                  <Table.HeaderCell key={roleId} textAlign="center">
                    {/* 合計 */}
                    {/* <div style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                      {roleTotal}
                    </div> */}

                    {/* 平均：小字、灰色、帶有說明 */}
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.1em",
                        // color: "#666",
                      }}
                    >
                      {Math.round(roleTotal / roleData.length)}
                    </div>
                  </Table.HeaderCell>
                );
              },
            )}
          </Table.Row>
        </Table.Footer>
      </Table>
      {/* 顯示表格標題(使用角色欄) */}
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>場次/角色</Table.HeaderCell>
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
