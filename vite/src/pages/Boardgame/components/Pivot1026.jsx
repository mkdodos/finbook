import { useState } from "react";
import { Table, Label, Header } from "semantic-ui-react";

export default function Pivot1026({ data }) {
  console.log(data);
  // 顯示平均或總分
  const [isShowAvg, setIsShowAvg] = useState(false);

  const selectedGame = "茂林";

  // 過濾資料
  const filteredData = data.filter((item) => item.game_name === selectedGame);

  // 依人數篩選(0:全部)
  const DataByPlayerCount = (counts) => {
    if (counts == 0) return filteredData;
    return filteredData.filter((item) => item.player_count == counts);
  };

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

  // 欄（以 role_id 群組）與列（以 session_id 群組）

  // 準備群組資料
  // 依角色
  const groupedByRole = Object.entries(
    groupedData(filteredData, "role_id"),
  ).sort((a, b) => b[1].total - a[1].total);
  // 依場次
  const groupedBySession = Object.entries(
    groupedData(filteredData, "session_id"),
  ).sort((a, b) => {
    // 依日期排序
    return new Date(b[1].data[0].play_date) - new Date(a[1].data[0].play_date);
  });
  const groupedBySession3 = Object.entries(
    groupedData(DataByPlayerCount(3), "session_id"),
  ).sort((a, b) => {
    // 依日期排序
    return new Date(b[1].data[0].play_date) - new Date(a[1].data[0].play_date);
  });
  const groupedBySession4 = Object.entries(
    groupedData(DataByPlayerCount(4), "session_id"),
  ).sort((a, b) => {
    // 依日期排序
    return new Date(b[1].data[0].play_date) - new Date(a[1].data[0].play_date);
  });
  // 依玩家群組
  const groupedByPlayer = Object.entries(
    groupedData(filteredData, "player_id"),
  );
  // 顯示平均
  const handleToggle = () => {
    setIsShowAvg(!isShowAvg);
  };

  // 依指定欄位群組

  // 依角色(3人局)
  const groupedByRole3 = Object.entries(
    groupedData(DataByPlayerCount(3), "role_id"),
  );

  // 依玩家(3人局)
  const groupedByPlayer3 = Object.entries(
    groupedData(DataByPlayerCount(3), "player_id"),
  );

  // 依角色(4人局)
  const groupedByRole4 = Object.entries(
    groupedData(DataByPlayerCount(4), "role_id"),
  );

  // 依玩家(4人局)
  const groupedByPlayer4 = Object.entries(
    groupedData(DataByPlayerCount(4), "player_id"),
  );

  // console.log(DataByPlayerCount(0));
  // console.log(groupedData(DataByPlayerCount(4), "role_id"));
  // 表格(玩家/角色)
  const PlayerRole = () => {
    return (
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
            <Table.HeaderCell textAlign="center">合計</Table.HeaderCell>
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
                        <Table.Cell
                          key={roleId}
                          textAlign="center"
                          style={{ position: "relative" }}
                        >
                          {/* 中間的主體內容 */}
                          <div>
                            {matched.length > 0 &&
                              isShowAvg &&
                              Math.round(groupSum / matched.length)}
                            {!isShowAvg && groupSum}
                          </div>

                          {/* 右上角角落的 Label */}
                          <Label
                            size="small" // 可選：讓角標小一點，在儲存格內視覺效果較佳
                            style={{
                              position: "absolute",
                              top: "50%",
                              transform: "translateY(-50%)",
                              // top: 20,
                              right: 5,
                              margin: 0,
                            }}
                          >
                            {matched.length}
                          </Label>
                        </Table.Cell>
                      );
                    },
                  )}
                  {/* 列合計 */}
                  <Table.Cell textAlign="center">
                    {isShowAvg
                      ? Math.round(playerTotal / playerData.length)
                      : playerTotal}
                  </Table.Cell>
                </Table.Row>
              );
            },
          )}
          {/* 顯示欄列對應資料 */}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell onClick={handleToggle}>
              平均/總分
            </Table.HeaderCell>
            {groupedByRole.map(
              ([roleId, { data: roleData, total: roleTotal }]) => {
                return (
                  <Table.HeaderCell key={roleId} textAlign="center">
                    {/* 平均：小字、灰色、帶有說明 */}
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.1em",
                        // color: "#666",
                      }}
                    >
                      {isShowAvg
                        ? Math.round(roleTotal / roleData.length)
                        : roleTotal}
                    </div>
                  </Table.HeaderCell>
                );
              },
            )}
            <Table.HeaderCell onClick={handleToggle}>
              {/* {roleTotal} */}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  };

  // 表格(場次/角色)
  const SessionRole = () => {
    return (
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
    );
  };

  const SessionPlayer = (columnData, rowData, columnName, cellName) => {
    return (
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>場次/角色</Table.HeaderCell>
            {columnData.map(
              ([roleId, { data: roleData, total: roleTotal }]) => {
                return (
                  <Table.HeaderCell key={roleId} textAlign="center">
                    {roleData[0]?.[columnName]}
                  </Table.HeaderCell>
                );
              },
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {/* 列資料(第1格),各場次 */}
          {rowData.map(
            ([sessionId, { data: sessionData, total: sessionTotal }]) => {
              return (
                <Table.Row key={sessionId}>
                  <Table.Cell>{sessionData[0].play_date}</Table.Cell>
                  {/* 角色,對應場次 */}
                  {columnData.map(
                    ([roleId, { data: roleData, total: roleTotal }]) => {
                      // 尋找分數
                      const matched = sessionData.find(
                        (item) => item.player_id == roleId,
                      );
                      //   const points = Number(matched.points) || 0;
                      return (
                        <Table.Cell key={roleId} textAlign="center">
                          {matched?.[cellName]}
                          {matched?.[cellName] && " / "}
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
            {columnData.map(
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
    );
  };

  // 通用表格
  const GenPivotTable = (columnData, rowData) => {
    return (
      <Table selectable>
        <Table.Header>
          <Table.Row>
            {/* <Table.HeaderCell>第一列欄名</Table.HeaderCell> */}
            <Table.HeaderCell>玩家/角色</Table.HeaderCell>
            {columnData.map(
              ([roleId, { data: roleData, total: roleTotal }]) => {
                return (
                  <Table.HeaderCell key={roleId} textAlign="center">
                    {roleData[0]?.role_name}
                  </Table.HeaderCell>
                );
              },
            )}
            <Table.HeaderCell>#</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {/* 列資料(第1格),玩家 */}
          {rowData.map(
            ([playerId, { data: playerData, total: playerTotal }]) => {
              return (
                <Table.Row key={playerId}>
                  <Table.Cell>{playerData[0].player_name}</Table.Cell>
                  {columnData.map(
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
                        <Table.Cell
                          key={roleId}
                          textAlign="center"
                          style={{ position: "relative" }}
                        >
                          {/* 中間的主體內容 */}
                          <div>
                            {matched.length > 0 &&
                              isShowAvg &&
                              Math.round(groupSum / matched.length)}
                            {!isShowAvg && groupSum}
                          </div>
                          <Label
                            size="small" // 可選：讓角標小一點，在儲存格內視覺效果較佳
                            style={{
                              position: "absolute",
                              top: "50%",
                              transform: "translateY(-50%)",
                              // top: 20,
                              right: 5,
                              margin: 0,
                            }}
                          >
                            {matched.length}
                          </Label>
                        </Table.Cell>
                      );
                    },
                  )}
                  {/* 列合計 */}
                  <Table.Cell textAlign="center">
                    {isShowAvg
                      ? Math.round(playerTotal / playerData.length)
                      : playerTotal}
                  </Table.Cell>
                </Table.Row>
              );
            },
          )}
          {/* 顯示欄列對應資料 */}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell onClick={handleToggle}>
              {isShowAvg ? "平均" : "總分"}
            </Table.HeaderCell>
            {columnData.map(
              ([roleId, { data: roleData, total: roleTotal }]) => {
                return (
                  <Table.HeaderCell key={roleId} textAlign="center">
                    {/* 平均：小字、灰色、帶有說明 */}
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.1em",
                        // color: "#666",
                      }}
                    >
                      {isShowAvg
                        ? Math.round(roleTotal / roleData.length)
                        : roleTotal}
                    </div>
                  </Table.HeaderCell>
                );
              },
            )}
            <Table.HeaderCell onClick={handleToggle}>
              {/* {roleTotal} */}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  };

  return (
    <>
      {/* 4人局 */}
      <Header>4人局</Header>
      {GenPivotTable(groupedByRole4, groupedByPlayer4)}
      {/* 3人局 */}
      <Header>3人局</Header>
      {GenPivotTable(groupedByRole3, groupedByPlayer3)}
      <Header>3/4人局</Header>
      {GenPivotTable(groupedByRole, groupedByPlayer)}
      <Header>場次/玩家</Header>
      {SessionPlayer(
        groupedByPlayer,
        groupedBySession,
        "player_name",
        "role_name",
      )}
      <Header>場次/玩家4</Header>
      {SessionPlayer(
        groupedByPlayer4,
        groupedBySession4,
        "player_name",
        "role_name",
      )}
      <Header>場次/玩家3</Header>
      {SessionPlayer(
        groupedByPlayer3,
        groupedBySession3,
        "player_name",
        "role_name",
      )}
      {/* {PlayerRole()} */}
      {/* {SessionRole()} */}
    </>
  );
}
