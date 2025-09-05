import { Table, Button, Modal, Form, Input, InputNumber, message } from "antd";
import { useEffect, useState } from "react";
import api from "../../../api";

export default function WarehousesTable() {
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
        message.success("Склад добавлен");
        setOpen(false);
        form.resetFields();
        load();
      });
    });
  };

  const onDelete = (id: number) => {
    api.delete(`/api/warehouses/${id}`).then(() => {
      message.success("Удалено");
      load();
    });
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Добавить склад
      </Button>
      <Table
        rowKey="id"
        dataSource={data}
        scroll={{ x: true }}
        columns={[
          { title: "ID", dataIndex: "id" },
          { title: "Название", dataIndex: "name" },
          { title: "Локация", dataIndex: "location" },
          { title: "Имя", dataIndex: "firstName" },
          { title: "Фамилия", dataIndex: "lastName" },
          { title: "Адрес 1", dataIndex: "addresLine1" },
          { title: "Адрес 2", dataIndex: "addresLine2" },
          { title: "Город", dataIndex: "city" },
          { title: "Штат/Регион", dataIndex: "state" },
          { title: "Почтовый индекс", dataIndex: "zipcode" },
          { title: "Телефон", dataIndex: "telephone" },
          { title: "Мобильный", dataIndex: "cell" },
          { title: "Создан", dataIndex: "createdAt" },
          {
            title: "Действия",
            render: (_, record) => (
              <Button danger onClick={() => onDelete(record.id)}>
                Удалить
              </Button>
            ),
          },
        ]}
      />
      <Modal title="Добавить склад" open={open} onCancel={() => setOpen(false)} onOk={onCreate}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Название" rules={[{ required: true, message: "Введите название" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Локация">
            <Input />
          </Form.Item>
          <Form.Item name="firstName" label="Имя">
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Фамилия">
            <Input />
          </Form.Item>
          <Form.Item name="addresLine1" label="Адрес 1">
            <Input />
          </Form.Item>
          <Form.Item name="addresLine2" label="Адрес 2">
            <Input />
          </Form.Item>
          <Form.Item name="city" label="Город">
            <Input />
          </Form.Item>
          <Form.Item name="state" label="Штат/Регион">
            <Input />
          </Form.Item>
          <Form.Item name="zipcode" label="Почтовый индекс">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="telephone" label="Телефон">
            <Input />
          </Form.Item>
          <Form.Item name="cell" label="Мобильный">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
