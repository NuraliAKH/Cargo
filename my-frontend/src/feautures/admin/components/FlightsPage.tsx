import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  Table,
  message,
  Popconfirm,
  Tag,
} from "antd";
import api from "../../../api";

const { RangePicker } = DatePicker;

const STATUS_LABELS: Record<string, string> = {
  SCHEDULED: "Запланирован",
  DEPARTED: "Вылетел",
  ARRIVED: "Прибыл",
  CANCELLED: "Отменён",
};

export default function FlightsPage() {
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
      message.error("Не удалось загрузить рейсы");
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
        message.success("Рейс обновлён");
      } else {
        await api.post("/api/flights", payload);
        message.success("Рейс создан");
      }

      setOpenModal(false);
      form.resetFields();
      setEditing(null);
      load();
    } catch {
      message.error("Ошибка при сохранении рейса");
    }
  };

  const onDelete = async (id: number) => {
    try {
      await api.delete(`/api/flights/${id}`);
      message.success("Рейс удалён");
      load();
    } catch {
      message.error("Не удалось удалить рейс");
    }
  };

  const columns = [
    { title: "Код", dataIndex: "code" },
    { title: "Статус", dataIndex: "status", render: (s: string) => <Tag>{STATUS_LABELS[s]}</Tag> },
    { title: "Отправление", dataIndex: "departureFrom" },
    { title: "Прибытие", dataIndex: "arrivalTo" },
    { title: "Дата вылета", dataIndex: "departureAt", render: (d: string) => new Date(d).toLocaleString() },
    { title: "Дата прибытия", dataIndex: "arrivalAt", render: (d: string) => (d ? new Date(d).toLocaleString() : "-") },
    {
      title: "Действия",
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
                dates: [record.departureAt, record.arrivalAt].filter(Boolean),
                capacityKg: Number(record.capacityKg),
              });
              setOpenModal(true);
            }}
          >
            Редактировать
          </Button>
          <Popconfirm title="Удалить рейс?" onConfirm={() => onDelete(record.id)}>
            <Button type="link" danger>
              Удалить
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Card
      title="Рейсы"
      extra={
        <Button type="primary" onClick={() => setOpenModal(true)}>
          Добавить рейс
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
        title={editing ? "Редактировать рейс" : "Добавить рейс"}
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
          <Form.Item name="code" label="Код рейса">
            <Input placeholder="Например: HY123" />
          </Form.Item>

          <Form.Item name="status" label="Статус" initialValue="SCHEDULED">
            <Select options={Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))} />
          </Form.Item>

          <Form.Item
            name="departureFrom"
            label="Город вылета"
            rules={[{ required: true, message: "Введите город вылета" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="arrivalTo"
            label="Город прибытия"
            rules={[{ required: true, message: "Введите город прибытия" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="dates" label="Дата и время" rules={[{ required: true, message: "Укажите даты" }]}>
            <RangePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
