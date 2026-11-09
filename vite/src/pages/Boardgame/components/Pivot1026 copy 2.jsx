import { useState } from "react";
import { Table, Label } from "semantic-ui-react";

export default function Pivot1026({ data }) {
  console.log(data);
  // 顯示平均或總分
  const [isShowAvg, setIsShowAvg] = useState(false);

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
  // 依玩家群組
  const groupedByPlayer = Object.entries(
    groupedData(filteredData, "player_id"),
  );
  // 顯示平均
  const handleToggle = () => {
    setIsShowAvg(!isShowAvg);
  };

  // 依指定欄位群組

  // 依人數篩選(0:全部)
  const DataByPlayerCount = (counts) => {
    if (counts == 0) return filteredData;
    return filteredData.filter((item) => item.player_count == counts);
  };
  // 依角色(3人局)
  const groupedByRole3 = Object.entries(
    groupedData(DataByPlayerCount(3), "role_id"),
  );

  // 依玩家(3人局)
  const groupedByPlayer3 = Object.entries(
    groupedData(DataByPlayerCount(3), "player_id"),
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

  // 通用表格
  const GenPivotTable = (columns) => {
    return (
      <Table>
        <Table.Header>
          <Table.Row>
            {/* <Table.HeaderCell>第一列欄名</Table.HeaderCell> */}
            <Table.HeaderCell>玩家/角色</Table.HeaderCell>
            {groupedByRole3.map(
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
          {groupedByPlayer3.map(
            ([playerId, { data: playerData, total: playerTotal }]) => {
              return (
                <Table.Row key={playerId}>
                  <Table.Cell>{playerData[0].player_name}</Table.Cell>
                  {groupedByRole3.map(
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
              平均/總分
            </Table.HeaderCell>
            {groupedByRole3.map(
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
      {GenPivotTable()}
      {PlayerRole()}
      {SessionRole()}
    </>
  );
}
