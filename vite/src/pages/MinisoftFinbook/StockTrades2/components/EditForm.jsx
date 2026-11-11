import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Icon } from "semantic-ui-react";
import { createRow, updateRow } from "../data/api";
// import GameSelect from "../../components/dropdown/GameSelect";

function EditForm({
  isOpen,
  onClose,
  editData,
  handleDelete,
  setData,
  columns,
}) {
  // A component is changing an uncontrolled input to be controlled
  // 需要給表單每個欄位預設值,確保是受控組件
  // 否則會出現上述警告

  console.log(editData);

  // 動態產生 initialFormData
  // const initialFormData = columns
  //   .filter((col) => col.formShow) // 通常只抓需要在表單顯示的欄位
  //   .reduce((acc, col) => {
  //     if (col.type === "date")
  //       // 日期欄位(預設當天)
  //       acc[col.field] = new Date().toISOString().substring(0, 10);
  //     // 優先使用 JSON 裡的 defaultValue，如果沒有則根據型別給預設值
  //     if (col.defaultValue !== undefined) {
  //       acc[col.field] = col.defaultValue;
  //     } else {
  //       acc[col.field] = "";
  //       // col.type === "number" || col.type === "decimal" ? 0 : "";
  //     }
  //     return acc;
  //   }, {});

  const initialFormData = columns
    .filter((col) => col.formShow)
    .reduce((acc, col) => {
      // 1. 優先檢查 JSON 裡有沒有寫死的 defaultValue
      if (col.defaultValue !== undefined && col.defaultValue !== null) {
        acc[col.field] = col.defaultValue;
      }
      // 2. 如果沒有，但它是日期型別，就自動產生「本地時間」的今天 (YYYY-MM-DD)
      else if (col.type === "date") {
        const now = new Date();
        // 使用本地時間的年月日，避免 UTC 時區誤差
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        acc[col.field] = `${year}-${month}-${day}`;
      }
      // 3. 其他型別的預設空值
      else {
        acc[col.field] =
          col.type === "number" || col.type === "decimal" ? 0 : "";
      }

      return acc;
    }, {});

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (editData) {
      console.log(editData);
      setFormData(
        editData,
        // name: editData.name || "",
      );
    } else {
      setFormData(initialFormData);
    }
  }, [isOpen, editData]);

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (editData) {
        await updateRow(editData.id, formData);
        // 將儲存成功的值寫入state
        setData((prev) =>
          prev.map((item) => (item.id === formData.id ? formData : item)),
        );
      } else {
        const res = await createRow(formData);
        // 將儲存成功的值寫入state
        setData((prev) => [...prev, { ...formData, id: res.id }]);
      }

      if (onClose) onClose();
    } catch (err) {
      console.log(err);
      alert("儲存失敗，請檢查輸入內容");
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="small">
      <Modal.Header>{editData ? "✏️ 編輯" : "📝 新增"}</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit} id="scorecard-form">
          {/* 4. 透過 map 走訪 JSON 動態產生對應的表單欄位 */}
          {columns
            .filter((col) => col.formShow)
            .map((col) => {
              // 根據 component 類型渲染不同的 Semantic UI 元件
              if (col.component === "select") {
                return (
                  <Form.Select
                    key={col.field}
                    label={col.label}
                    name={col.field}
                    value={formData[col.field]}
                    options={col.options}
                    onChange={handleChange}
                    required={col.required}
                  />
                );
              }

              // 預設渲染一般文字或數字輸入框
              return (
                <Form.Input
                  key={col.field}
                  label={col.label}
                  name={col.field}
                  type={col.type}
                  // 關鍵在這裡：如果 formData[col.field] 是 null 或 undefined，就強制轉成 ""
                  value={formData[col.field] ?? ""}
                  // value={formData[col.field]}
                  onChange={handleChange}
                  required={col.required}
                />
              );
            })}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>取消</Button>
        <Button primary type="submit" form="scorecard-form">
          儲存
        </Button>
        <Button
          floated="left"
          color="red"
          size="mini"
          icon
          onClick={() => handleDelete(formData.id)}
          title="刪除"
        >
          <Icon name="trash" />
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default EditForm;
