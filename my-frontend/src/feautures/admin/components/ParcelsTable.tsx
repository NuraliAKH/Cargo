import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, DatePicker, Space, Tooltip } from "antd";
import { useEffect, useMemo, useState } from "react";
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import api from "../../../api";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

const STATUS_OPTIONS = [
  { value: "AWAITING_AT_WAREHOUSE", label: "Ожидается на складе" },
  { value: "AT_WAREHOUSE", label: "На складе" },
  { value: "IN_TRANSIT", label: "В пути" },
  { value: "AT_LOCAL_WAREHOUSE", label: "В местном складе" },
  { value: "WITH_COURIER", label: "У курьера" },
  { value: "DELIVERED", label: "Доставлено" },
];

interface Parcel {
  user: any;
  id: number;
  trackingCode: string;
  status: string;
  owner?: { email: string };
  warehouse?: { name: string };
  createdAt?: string;
}

export default function ParcelsTable() {
  const [data, setData] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParcel, setEditingParcel] = useState<Parcel | null>(null);
  const [form] = Form.useForm();

  const [emailFilter, setEmailFilter] = useState("");
  const [trackingFilter, setTrackingFilter] = useState("");
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/parcels");
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const emailMatch = emailFilter ? item.user?.email?.toLowerCase().includes(emailFilter.toLowerCase()) : true;
      const trackingMatch = trackingFilter
        ? item.trackingCode.toLowerCase().includes(trackingFilter.toLowerCase())
        : true;
      const dateMatch = dateRange
        ? item.createdAt &&
          dayjs(item.createdAt).isAfter(dateRange[0].startOf("day")) &&
          dayjs(item.createdAt).isBefore(dateRange[1].endOf("day"))
        : true;

      return emailMatch && trackingMatch && dateMatch;
    });
  }, [data, emailFilter, trackingFilter, dateRange]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingParcel) {
        await api.patch(`/api/parcels/${editingParcel.id}`, values);
        message.success("Посылка обновлена");
      } else {
        await api.post("/api/parcels", values);
        message.success("Посылка создана");
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/api/parcels/${id}`);
    message.success("Посылка удалена");
    await loadData();
  };

  return (
    <div style={{ padding: 16 }}>
      <Space style={{ marginBottom: 16, flexWrap: "wrap" }} align="center">
        <Input
          placeholder="Поиск по email"
          value={emailFilter}
          onChange={e => setEmailFilter(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Input
          placeholder="Поиск по трек-коду"
          value={trackingFilter}
          onChange={e => setTrackingFilter(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <RangePicker onChange={dates => setDateRange(dates as [Dayjs, Dayjs] | null)} />
        <Button icon={<ReloadOutlined />} onClick={loadData}>
          Обновить
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingParcel(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Создать посылку
        </Button>
      </Space>

      <Table
        dataSource={filteredData}
        rowKey="id"
        loading={loading}
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        style={{ minHeight: 400 }}
        columns={[
          {
            title: "Трек-код",
            dataIndex: "trackingCode",
            responsive: ["xs", "sm", "md", "lg"],
          },
          {
            title: "Владелец",
            dataIndex: ["user", "email"],
            render: v => v || "—",
            responsive: ["md"],
          },
          {
            title: "Склад",
            dataIndex: ["warehouse", "name"],
            render: v => v || "—",
            responsive: ["lg"],
          },
          {
            title: "Статус",
            dataIndex: "status",
            render: (status, record) => (
              <Select
                value={status}
                style={{ width: 220 }}
                options={STATUS_OPTIONS}
                onChange={async value => {
                  await api.patch(`/api/parcels/${record.id}/status`, {
                    status: value,
                  });
                  message.success("Статус обновлён");
                  await loadData();
                }}
              />
            ),
            responsive: ["sm", "md", "lg"],
          },
          {
            title: "Создано",
            dataIndex: "createdAt",
            render: v => (v ? dayjs(v).format("YYYY-MM-DD HH:mm") : "—"),
            responsive: ["md"],
          },
          {
            title: "Действия",
            fixed: "right",
            render: (_, record) => (
              <Space>
                <Tooltip title="Редактировать">
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setEditingParcel(record);
                      form.setFieldsValue(record);
                      setIsModalOpen(true);
                    }}
                  />
                </Tooltip>
                <Popconfirm title="Удалить посылку?" onConfirm={() => handleDelete(record.id)}>
                  <Button type="link" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={editingParcel ? "Редактировать посылку" : "Создать посылку"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText="Сохранить"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="trackingCode" label="Трек-код" rules={[{ required: true, message: "Введите трек-код" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Статус" initialValue="AWAITING_AT_WAREHOUSE">
            <Select options={STATUS_OPTIONS} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
