import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import api from "../../../api";

export default function UsersTable() {
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const load = () => api.get("/api/users").then(r => setData(r.data));
  useEffect(() => {
    load();
  }, []);

  const onCreate = () => {
    form.validateFields().then(values => {
      api.post("/api/users", values).then(() => {
        message.success("Пользователь создан");
        setOpen(false);
        form.resetFields();
        load();
      });
    });
  };

  const onRoleChange = async (id: number, role: string) => {
    try {
      await api.put(`/api/users/${id}/role`, { role });
      message.success("Роль изменена");
      load();
    } catch {
      message.error("Не удалось изменить роль");
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Добавить
      </Button>

      <Table
        rowKey="id"
        scroll={{ x: true }}
        dataSource={data}
        columns={[
          { title: "Email", dataIndex: "email" },
          {
            title: "Роль",
            dataIndex: "role",
            render: (role: string, record: any) => (
              <Select
                value={role}
                onChange={newRole => onRoleChange(record.id, newRole)}
                options={[
                  { value: "USER", label: "Пользователь" },
                  { value: "ADMIN", label: "Администратор" },
                ]}
                style={{ width: 150 }}
              />
            ),
          },
          {
            title: "Действия",
            render: (_, record) => (
              <Button
                danger
                onClick={() => {
                  api.delete(`/api/users/${record.id}`).then(() => {
                    message.success("Удалено");
                    load();
                  });
                }}
              >
                Удалить
              </Button>
            ),
          },
        ]}
      />

      <Modal title="Создать пользователя" open={open} onCancel={() => setOpen(false)} onOk={onCreate} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Пароль" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="role" label="Роль" initialValue="USER" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "USER", label: "Пользователь" },
                { value: "ADMIN", label: "Администратор" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
