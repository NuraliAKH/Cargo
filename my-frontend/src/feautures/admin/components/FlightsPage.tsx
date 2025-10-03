import { useEffect, useState } from "react";
import { Button, Card, Modal, Form, Input, DatePicker, Select, Table, message, Popconfirm, Tag } from "antd";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import api from "../../../api";

const { RangePicker } = DatePicker;

export default function FlightsPage() {
  const { t } = useTranslation();
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/flights");
      setFlights(res.data);
    } catch {
      message.error(t("flights.errors.load"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (values: any) => {
    try {
      const payload = {
        code: values.code,
        status: values.status,
        departureAt: values.dates[0],
        arrivalAt: values.dates[1] || null,
        departureFrom: values.departureFrom,
        arrivalTo: values.arrivalTo,
      };

      if (editing) {
        await api.put(`/api/flights/${editing.id}`, payload);
        message.success(t("flights.updated"));
      } else {
        await api.post("/api/flights", payload);
        message.success(t("flights.created"));
      }

      setOpenModal(false);
      form.resetFields();
      setEditing(null);
      load();
    } catch {
      message.error(t("flights.errors.save"));
    }
  };

  const onDelete = async (id: number) => {
    try {
      await api.delete(`/api/flights/${id}`);
      message.success(t("flights.deleted"));
      load();
    } catch {
      message.error(t("flights.errors.delete"));
    }
  };

  const columns = [
    { title: t("flights.columns.code"), dataIndex: "code" },
    {
      title: t("flights.columns.status"),
      dataIndex: "status",
      render: (s: string) => <Tag>{t(`flights.status.${s}`)}</Tag>,
    },
    { title: t("flights.columns.departureFrom"), dataIndex: "departureFrom" },
    { title: t("flights.columns.arrivalTo"), dataIndex: "arrivalTo" },
    {
      title: t("flights.columns.departureAt"),
      dataIndex: "departureAt",
      render: (d: string) => new Date(d).toLocaleString(),
    },
    {
      title: t("flights.columns.arrivalAt"),
      dataIndex: "arrivalAt",
      render: (d: string) => (d ? new Date(d).toLocaleString() : "-"),
    },
    {
      title: t("flights.columns.actions"),
      render: (_: any, record: any) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setEditing(record);
              form.setFieldsValue({
                code: record.code,
                status: record.status,
                departureFrom: record.departureFrom,
                arrivalTo: record.arrivalTo,
                dates: [
                  record.departureAt ? dayjs(record.departureAt) : null,
                  record.arrivalAt ? dayjs(record.arrivalAt) : null,
                ].filter(Boolean),
              });
              setOpenModal(true);
            }}
          >
            {t("flights.edit")}
          </Button>
          <Popconfirm title={t("flights.confirmDelete")} onConfirm={() => onDelete(record.id)}>
            <Button type="link" danger>
              {t("flights.delete")}
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Card
      title={t("flights.title")}
      extra={
        <Button type="primary" onClick={() => setOpenModal(true)}>
          {t("flights.add")}
        </Button>
      }
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={flights}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />

      <Modal
        title={editing ? t("flights.modal.edit") : t("flights.modal.add")}
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={onSubmit}>
          <Form.Item name="code" label={t("flights.form.code")}>
            <Input placeholder="HY123" />
          </Form.Item>

          <Form.Item name="status" label={t("flights.form.status")} initialValue="SCHEDULED">
            <Select
              options={[
                { value: "SCHEDULED", label: t("flights2.status.SCHEDULED") },
                { value: "DEPARTED", label: t("flights2.status.DEPARTED") },
                { value: "ARRIVED", label: t("flights2.status.ARRIVED") },
                { value: "CANCELLED", label: t("flights2.status.CANCELLED") },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="departureFrom"
            label={t("flights.form.departureFrom")}
            rules={[{ required: true, message: t("flights.form.departureFromRequired") }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="arrivalTo"
            label={t("flights.form.arrivalTo")}
            rules={[{ required: true, message: t("flights.form.arrivalToRequired") }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="dates"
            label={t("flights.form.dates")}
            rules={[{ required: true, message: t("flights.form.datesRequired") }]}
          >
            <RangePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
