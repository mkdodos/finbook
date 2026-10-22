import { Table } from "semantic-ui-react";

export default function PivotTemplate({ rows, rowkey, columns, colkey, data }) {
  return (
    <div>
      <Table celled striped selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>rows / columns</Table.HeaderCell>
            {/* 橫軸 */}
            {columns.map((col) => (
              <Table.HeaderCell key={col.id} textAlign="center">
                {col[colkey]}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {/* 縱軸：顯示該遊戲的所有 Session (場次) */}
          {rows.map((row) => {
            return (
              <Table.Row key={row.id}>
                {/* 第一欄 */}
                <Table.Cell style={{ fontWeight: "bold" }}>
                  {row[rowkey]}
                </Table.Cell>
                {/* 資料欄,欄迴圈 */}
                {columns.map((col) => {
                  // 尋找對應欄列資料
                  const rowData = row[rowkey];
                  const colData = col[colkey];
                  const matchData = data.find(
                    (item) =>
                      item[rowkey] == rowData && item[colkey] == colData,
                  );
                  return (
                    <Table.Cell key={col.id}>
                      {matchData?.score}
                      {/* {row[rowkey]}
                      {col[colkey]} */}
                    </Table.Cell>
                  );
                })}
                {/* <Table.Cell style={{ fontWeight: "bold" }}>
                  {row[rowkey]}
                </Table.Cell> */}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}
