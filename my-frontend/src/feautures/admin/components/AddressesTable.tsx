import { Table, Button, Modal, Form, Input, InputNumber, message } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../api";

export default function WarehousesTable() {
  const { t } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const load = () => api.get("/api/warehouses").then(r => setData(r.data));

  useEffect(() => {
    load();
  }, []);

  const onCreate = () => {
    form.validateFields().then(values => {
      api.post("/api/warehouses", values).then(() => {
        message.success(t("warehouses.added"));
        setOpen(false);
        form.resetFields();
        load();
      });
    });
  };

  const onDelete = (id: number) => {
    api.delete(`/api/warehouses/${id}`).then(() => {
      message.success(t("warehouses.deleted"));
      load();
    });
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        {t("warehouses.addWarehouse")}
      </Button>
      <Table
        rowKey="id"
        dataSource={data}
        scroll={{ x: true }}
        columns={[
          { title: t("warehouses.columns.id"), dataIndex: "id" },
          { title: t("warehouses.columns.name"), dataIndex: "name" },
          { title: t("warehouses.columns.location"), dataIndex: "location" },
          { title: t("warehouses.columns.firstName"), dataIndex: "firstName" },
          { title: t("warehouses.columns.lastName"), dataIndex: "lastName" },
          { title: t("warehouses.columns.addresLine1"), dataIndex: "addresLine1" },
          { title: t("warehouses.columns.addresLine2"), dataIndex: "addresLine2" },
          { title: t("warehouses.columns.city"), dataIndex: "city" },
          { title: t("warehouses.columns.state"), dataIndex: "state" },
          { title: t("warehouses.columns.zipcode"), dataIndex: "zipcode" },
          { title: t("warehouses.columns.telephone"), dataIndex: "telephone" },
          { title: t("warehouses.columns.cell"), dataIndex: "cell" },
          { title: t("warehouses.columns.createdAt"), dataIndex: "createdAt" },
          {
            title: t("warehouses.columns.actions"),
            render: (_, record) => (
              <Button danger onClick={() => onDelete(record.id)}>
                {t("warehouses.delete")}
              </Button>
            ),
          },
        ]}
      />
      <Modal title={t("warehouses.modalTitle")} open={open} onCancel={() => setOpen(false)} onOk={onCreate}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={t("warehouses.form.name")}
            rules={[{ required: true, message: t("warehouses.form.nameRequired") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="location" label={t("warehouses.form.location")}>
            <Input />
          </Form.Item>
          <Form.Item name="firstName" label={t("warehouses.form.firstName")}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label={t("warehouses.form.lastName")}>
            <Input />
          </Form.Item>
          <Form.Item name="addresLine1" label={t("warehouses.form.addresLine1")}>
            <Input />
          </Form.Item>
          <Form.Item name="addresLine2" label={t("warehouses.form.addresLine2")}>
            <Input />
          </Form.Item>
          <Form.Item name="city" label={t("warehouses.form.city")}>
            <Input />
          </Form.Item>
          <Form.Item name="state" label={t("warehouses.form.state")}>
            <Input />
          </Form.Item>
          <Form.Item name="zipcode" label={t("warehouses.form.zipcode")}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="telephone" label={t("warehouses.form.telephone")}>
            <Input />
          </Form.Item>
          <Form.Item name="cell" label={t("warehouses.form.cell")}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
