import React, { useState, useEffect } from "react";
import { Table, Header, Input } from "semantic-ui-react";
import { updateScorecard } from "../api";

export default function PivotEdit({ data = [], onPointsChange }) {
  //   console.log(data);
  // 1. 本地狀態：記錄哪些資料被修改了，或者追蹤正在編輯的儲存格
  // 格式預期為 "sessionId_playerId"
  const [editingCell, setEditingCell] = useState(null);

  //   在 React 中，useState(data) 只會在元件「第一次掛載 (Mount)」時執行一次。
  // 如果你的資料是透過 API 非同步抓取的（例如頁面剛打開時 data 是空的 []，過了一秒資料才回來），父元件傳進來的 data 雖然更新了，但 tableData 因為是 State，不會自動跟著 prop 改變，導致畫面依然維持空資料的狀態。

  // 為了讓畫面可以即時反應修改，我們將傳入的 data 存入本地 state（也可以透過 callback 回傳給父元件）
  const [tableData, setTableData] = useState(data);

  // 2. 當外部的 data 改變時（例如 API 載入完成），同步更新本地 state
  useEffect(() => {
    setTableData(data);
  }, [data]);

  // 依照 game_name 進行遊戲分組
  const gamesObj = Object.groupBy(
    tableData,
    (item) => item.game_name || item.game_id,
  );
  const gameGroups = Object.entries(gamesObj);

  // 處理分數變更
  const handlePointChange = async (
    sessionId,
    playerId,
    newPoints,
    playerRecord,
  ) => {
    const updatedData = tableData.map((item) => {
      if (
        String(item.session_id) === String(sessionId) &&
        String(item.player_id) === String(playerId)
      ) {
        return { ...item, points: newPoints };
      }
      return item;
    });
    setTableData(updatedData);

    // 如果父元件需要接收更新後的資料，可以呼叫此 callback
    if (onPointsChange) {
      onPointsChange(updatedData);
    }

    // console.log({ id: playerRecord.scorecard_id, ...playerRecord });

    // 3. 呼叫後端 API 更新資料庫
    try {
      await updateScorecard(
        playerRecord.scorecard_id, // 第一個參數：id
        {
          ...playerRecord,
          points: newPoints, // 第二個參數：data 物件
        },
      );
      //   await updateScorecard({
      //     id: playerRecord.scorecard_id,
      //     ...playerRecord,
      //     points: newPoints, // 確保帶入最新的分數！
      //   });
    } catch (error) {
      console.error("更新分數失敗:", error);
      // 可以在這裡處理失敗邏輯（例如跳出錯誤提示，或重新整理資料）
      alert("更新分數失敗，請稍後再試");
    }

    // await updateScorecard({ id: playerRecord.scorecard_id, ...playerRecord });
  };

  const renderGamePivotTable = (gameName, gameRecords) => {
    const playersObj = Object.groupBy(gameRecords, (item) => item.player_id);
    const sessionsObj = Object.groupBy(gameRecords, (item) => item.session_id);

    const playerList = Object.entries(playersObj);
    const sessionList = Object.entries(sessionsObj);

    return (
      <div key={gameName} style={{ marginBottom: "2rem" }}>
        <Header as="h3" color="blue" dividing>
          🎮 遊戲：{gameName}
        </Header>

        <Table celled striped selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>日期 / 場次</Table.HeaderCell>
              {playerList.map(([playerId, pRecords]) => (
                <Table.HeaderCell key={playerId} textAlign="center">
                  {pRecords[0]?.player_name || `Player ${playerId}`}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {sessionList.map(([sId, sRecords]) => {
              const playDate = sRecords[0]?.play_date || `Session ${sId}`;

              return (
                <Table.Row key={sId}>
                  <Table.Cell style={{ fontWeight: "bold" }}>
                    {playDate} (場次 #{sId})
                  </Table.Cell>

                  {playerList.map(([playerId]) => {
                    const playerRecord = gameRecords.find(
                      (item) =>
                        String(item.player_id) === String(playerId) &&
                        String(item.session_id) === String(sId),
                    );

                    const cellKey = `${sId}_${playerId}`;
                    const isEditing = editingCell === cellKey;

                    return (
                      <Table.Cell
                        key={playerId}
                        textAlign="center"
                        onClick={() => playerRecord && setEditingCell(cellKey)}
                        style={{ cursor: playerRecord ? "pointer" : "default" }}
                      >
                        {isEditing ? (
                          /* 編輯狀態：顯示輸入框 */
                          <Input
                            autoFocus
                            size="mini"
                            value={playerRecord.points}
                            onChange={(e) =>
                              handlePointChange(
                                sId,
                                playerId,
                                e.target.value,
                                playerRecord,
                              )
                            }
                            onBlur={() => setEditingCell(null)} // 點擊外面時結束編輯
                            onKeyDown={(e) => {
                              if (e.key === "Enter") setEditingCell(null); // 按 Enter 也可以結束編輯
                            }}
                            style={{ width: "80px" }}
                          />
                        ) : (
                          /* 一般狀態：顯示分數 */
                          <div>
                            {playerRecord ? (
                              <strong>{playerRecord.points} 分</strong>
                            ) : (
                              <span style={{ color: "#ccc" }}>-</span>
                            )}
                          </div>
                        )}
                      </Table.Cell>
                    );
                  })}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    );
  };

  if (!tableData || tableData.length === 0) {
    return <div>目前沒有資料</div>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      {gameGroups.map(([gameName, gameRecords]) =>
        renderGamePivotTable(gameName, gameRecords),
      )}
    </div>
  );
}
