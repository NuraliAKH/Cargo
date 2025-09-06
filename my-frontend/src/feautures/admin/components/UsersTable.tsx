import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import api from "../../../api";
import { useTranslation } from "react-i18next";

export default function UsersTable() {
  const { t } = useTranslation();
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
        message.success(t("users.created"));
        setOpen(false);
        form.resetFields();
        load();
      });
    });
  };

  const onRoleChange = async (id: number, role: string) => {
    try {
      await api.put(`/api/users/${id}/role`, { role });
      message.success(t("users.role_changed"));
      load();
    } catch {
      message.error(t("users.role_change_error"));
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        {t("users.add")}
      </Button>

      <Table
        rowKey="id"
        scroll={{ x: true }}
        dataSource={data}
        columns={[
          { title: t("users.email"), dataIndex: "email" },
          {
            title: t("users.role"),
            dataIndex: "role",
            render: (role: string, record: any) => (
              <Select
                value={role}
                onChange={newRole => onRoleChange(record.id, newRole)}
                options={[
                  { value: "USER", label: t("users.roles.user") },
                  { value: "ADMIN", label: t("users.roles.admin") },
                ]}
                style={{ width: 150 }}
              />
            ),
          },
          {
            title: t("users.actions"),
            render: (_, record) => (
              <Button
                danger
                onClick={() => {
                  api.delete(`/api/users/${record.id}`).then(() => {
                    message.success(t("users.deleted"));
                    load();
                  });
                }}
              >
                {t("users.delete")}
              </Button>
            ),
          },
        ]}
      />

      <Modal title={t("users.create_modal")} open={open} onCancel={() => setOpen(false)} onOk={onCreate} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="email" label={t("users.email")} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label={t("users.password")} rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="role" label={t("users.role")} initialValue="USER" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "USER", label: t("users.roles.user") },
                { value: "ADMIN", label: t("users.roles.admin") },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
