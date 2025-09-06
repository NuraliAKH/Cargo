import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useTranslation } from "react-i18next";

const { Option } = Select;

export type RecipientType = "INDIVIDUAL" | "COMPANY";

interface Recipient {
  id: number;
  type: RecipientType;
  firstName: string;
  lastName: string;
  middleName?: string;
  passportSeries: string;
  passportNumber: string;
  jshshir: string;
  phone?: string;
  addressLine1?: string;
  city?: string;
  country?: string;
  createdAt: string;
}

const RecipientTable: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Recipient | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    const res = await axios.get<Recipient[]>("/api/recipients");
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdate = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await axios.put(`/api/recipients/${editing.id}`, values);
        message.success(t("recipients.updateSuccess"));
      } else {
        await axios.post(`/api/recipients`, values);
        message.success(t("recipients.createSuccess"));
      }
      setOpen(false);
      setEditing(null);
      form.resetFields();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/api/recipients/${id}`);
    message.success(t("recipients.deleteSuccess"));
    fetchData();
  };

  const columns: ColumnsType<Recipient> = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: t("recipients.type"), dataIndex: "type", key: "type" },
    { title: t("recipients.firstName"), dataIndex: "firstName", key: "firstName" },
    { title: t("recipients.lastName"), dataIndex: "lastName", key: "lastName" },
    { title: "JSHSHIR", dataIndex: "jshshir", key: "jshshir" },
    { title: t("recipients.phone"), dataIndex: "phone", key: "phone" },
    { title: t("recipients.city"), dataIndex: "city", key: "city" },
    { title: t("recipients.country"), dataIndex: "country", key: "country" },
    {
      title: t("recipients.actions"),
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditing(record);
              setOpen(true);
              form.setFieldsValue(record);
            }}
          >
            {t("recipients.edit")}
          </Button>
          <Popconfirm
            title={t("recipients.confirmDelete")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("recipients.yes")}
            cancelText={t("recipients.no")}
          >
            <Button type="link" danger>
              {t("recipients.delete")}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)} style={{ marginBottom: 16 }}>
        {t("recipients.add")}
      </Button>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} scroll={{ x: true }} />

      <Modal
        title={editing ? t("recipients.editTitle") : t("recipients.createTitle")}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={handleCreateOrUpdate}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="type" label={t("recipients.type")} rules={[{ required: true }]}>
            <Select>
              <Option value="INDIVIDUAL">{t("recipients.individual")}</Option>
              <Option value="COMPANY">{t("recipients.company")}</Option>
            </Select>
          </Form.Item>
          <Form.Item name="passportSeries" label={t("recipients.passportSeries")} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="passportNumber" label={t("recipients.passportNumber")} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="firstName" label={t("recipients.firstName")} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label={t("recipients.lastName")} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="middleName" label={t("recipients.middleName")}>
            <Input />
          </Form.Item>
          <Form.Item name="jshshir" label="JSHSHIR" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label={t("recipients.phone")}>
            <Input />
          </Form.Item>
          <Form.Item name="addressLine1" label={t("recipients.address")}>
            <Input />
          </Form.Item>
          <Form.Item name="city" label={t("recipients.city")}>
            <Input />
          </Form.Item>
          <Form.Item name="country" label={t("recipients.country")}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RecipientTable;
