import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, message, InputNumber } from "antd";
import api from "../../../api";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void; // вызови чтобы обновить список после создания
};

export default function AddParcelModal({ open, onClose, onCreated }: Props) {
  const [form] = Form.useForm();
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [recipients, setRecipients] = useState<any[]>([]);
  const [flights, setFlights] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    Promise.all([api.get("/api/warehouses"), api.get("/api/recipients"), api.get("/api/flights")]).then(([w, r, f]) => {
      setWarehouses(w.data || []);
      setRecipients(r.data || []);
      setFlights(f.data || []);
    });
  }, [open]);

  const onFinish = async (values: any) => {
    try {
      setSubmitting(true);
      await api.post("/api/parcels", {
        trackCode: values.trackCode,
        description: values.description || "",
        price: values.price || 0,
        warehouseId: values.warehouseId || null,
        recipientId: values.recipientId,
        flightId: values.flightId || null,
        status: "AWAITING_AT_WAREHOUSE", // статус по умолчанию
      });
      message.success("Посылка добавлена");
      form.resetFields();
      onCreated();
      onClose();
    } catch (e) {
      message.error("Не удалось добавить посылку");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Добавить посылку"
      open={open}
      onCancel={onClose}
      okText="Сохранить"
      confirmLoading={submitting}
      onOk={() => form.submit()}
      destroyOnClose
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="trackCode" label="Трек-номер" rules={[{ required: true, message: "Введите трек-номер" }]}>
          <Input placeholder="Например: AB123456789CN" />
        </Form.Item>

        <Form.Item name="description" label="Комментарий">
          <Input.TextArea placeholder="Примечания к посылке" />
        </Form.Item>

        <Form.Item name="price" label="Цена ($)" rules={[{ required: true, message: "Введите цену" }]}>
          <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
        </Form.Item>

        <Form.Item name="recipientId" label="Получатель" rules={[{ required: true, message: "Выберите получателя" }]}>
          <Select
            placeholder="Выберите получателя"
            options={recipients.map((r: any) => ({
              value: r.id ?? r._id,
              label: `${r.lastName} ${r.firstName}`,
            }))}
          />
        </Form.Item>

        <Form.Item name="warehouseId" label="Склад" rules={[{ required: true, message: "Выберите склад" }]}>
          <Select
            allowClear
            placeholder="Выберите склад"
            options={warehouses.map((w: any) => ({
              value: w.id ?? w._id,
              label: w.name,
            }))}
          />
        </Form.Item>

        <Form.Item name="flightId" label="Рейс (опционально)">
          <Select
            allowClear
            placeholder="Выберите рейс"
            options={flights.map((f: any) => ({
              value: f.id ?? f._id,
              label: f.code ?? `Рейс #${f.id}`,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
