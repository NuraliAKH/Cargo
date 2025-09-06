import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, DatePicker, Space, Tooltip } from "antd";
import { useEffect, useMemo, useState } from "react";
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import api from "../../../api";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";

const { RangePicker } = DatePicker;

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
  const { t } = useTranslation();
  const [data, setData] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParcel, setEditingParcel] = useState<Parcel | null>(null);
  const [form] = Form.useForm();

  const [emailFilter, setEmailFilter] = useState("");
  const [trackingFilter, setTrackingFilter] = useState("");
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  const STATUS_OPTIONS = useMemo(
    () =>
      Object.entries(t("parcels.statuses", { returnObjects: true }) as Record<string, string>).map(
        ([value, label]) => ({
          value,
          label,
        })
      ),
    [t]
  );

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
        message.success(t("parcels.updated"));
      } else {
        await api.post("/api/parcels", values);
        message.success(t("parcels.created"));
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/api/parcels/${id}`);
    message.success(t("parcels.deleted"));
    await loadData();
  };

  return (
    <div style={{ padding: 16 }}>
      <Space style={{ marginBottom: 16, flexWrap: "wrap" }} align="center">
        <Input
          placeholder={t("parcels.filters.search_email")}
          value={emailFilter}
          onChange={e => setEmailFilter(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Input
          placeholder={t("parcels.filters.search_tracking")}
          value={trackingFilter}
          onChange={e => setTrackingFilter(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <RangePicker onChange={dates => setDateRange(dates as [Dayjs, Dayjs] | null)} />
        <Button icon={<ReloadOutlined />} onClick={loadData}>
          {t("parcels.update")}
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
          {t("parcels.create")}
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
          { title: t("parcels.tracking_code"), dataIndex: "trackingCode" },
          { title: t("parcels.owner"), dataIndex: ["user", "email"], render: v => v || "—" },
          { title: t("parcels.warehouse"), dataIndex: ["warehouse", "name"], render: v => v || "—" },
          {
            title: t("parcels.status"),
            dataIndex: "status",
            render: (status, record) => (
              <Select
                value={status}
                style={{ width: 220 }}
                options={STATUS_OPTIONS}
                onChange={async value => {
                  await api.patch(`/api/parcels/${record.id}/status`, { status: value });
                  message.success(t("parcels.updated"));
                  await loadData();
                }}
              />
            ),
          },
          {
            title: t("parcels.created_at"),
            dataIndex: "createdAt",
            render: v => (v ? dayjs(v).format("YYYY-MM-DD HH:mm") : "—"),
          },
          {
            title: t("parcels.actions"),
            fixed: "right",
            render: (_, record) => (
              <Space>
                <Tooltip title={t("parcels.edit")}>
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
                <Popconfirm title={t("parcels.delete")} onConfirm={() => handleDelete(record.id)}>
                  <Button type="link" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={editingParcel ? t("parcels.edit") : t("parcels.create")}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText={t("parcels.save", { defaultValue: "Сохранить" })}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="trackingCode"
            label={t("parcels.tracking_code")}
            rules={[
              { required: true, message: t("parcels.enter_tracking_code", { defaultValue: "Введите трек-код" }) },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="status" label={t("parcels.status")} initialValue="AWAITING_AT_WAREHOUSE">
            <Select options={STATUS_OPTIONS} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
