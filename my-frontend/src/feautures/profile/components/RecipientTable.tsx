import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";

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
        message.success("Recipient updated");
      } else {
        await axios.post(`/api/recipients`, values);
        message.success("Recipient created");
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
    message.success("Recipient deleted");
    fetchData();
  };

  const handlePassportBlur = async () => {
    const series = form.getFieldValue("passportSeries");
    const number = form.getFieldValue("passportNumber");
    if (series && number) {
      // TODO: Bu yerda API orqali ism va familiyani olish
      // const res = await axios.get(`/api/passport-info?series=${series}&number=${number}`);
      // form.setFieldsValue({ firstName: res.data.firstName, lastName: res.data.lastName });
    }
  };

  const columns: ColumnsType<Recipient> = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    { title: "JSHSHIR", dataIndex: "jshshir", key: "jshshir" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "Country", dataIndex: "country", key: "country" },
    {
      title: "Actions",
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
            Edit
          </Button>
          <Popconfirm title="Delete this recipient?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)} style={{ marginBottom: 16 }}>
        Add Recipient
      </Button>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} scroll={{ x: true }} />

      <Modal
        title={editing ? "Edit Recipient" : "Create Recipient"}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={handleCreateOrUpdate}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select>
              <Option value="INDIVIDUAL">Individual</Option>
              <Option value="COMPANY">Company</Option>
            </Select>
          </Form.Item>
          <Form.Item name="passportSeries" label="Passport Series" rules={[{ required: true }]}>
            <Input onBlur={handlePassportBlur} />
          </Form.Item>
          <Form.Item name="passportNumber" label="Passport Number" rules={[{ required: true }]}>
            <Input onBlur={handlePassportBlur} />
          </Form.Item>
          <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="middleName" label="Middle Name">
            <Input />
          </Form.Item>
          <Form.Item name="jshshir" label="JSHSHIR" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="addressLine1" label="Address">
            <Input />
          </Form.Item>
          <Form.Item name="city" label="City">
            <Input />
          </Form.Item>
          <Form.Item name="country" label="Country">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RecipientTable;
