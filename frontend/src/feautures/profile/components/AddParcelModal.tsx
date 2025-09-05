import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import api from "../../../api";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void; // вызови чтобы обновить список после создания
};

export default function AddParcelModal({ open, onClose, onCreated }: Props) {
  const [form] = Form.useForm();
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    api.get("/api/warehouses").then(r => setWarehouses(r.data || []));
  }, [open]);

  const onFinish = async (values: any) => {
    try {
      setSubmitting(true);
      await api.post("/api/parcels", {
        warehouseId: values.warehouseId || null,
        comment: values.comment || "",
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
        <Form.Item name="warehouseId" label="Склад (опционально)">
          <Select
            allowClear
            placeholder="Выберите склад"
            options={warehouses.map((w: any) => ({
              value: w.id ?? w._id,
              label: w.name,
            }))}
          />
        </Form.Item>

        <Form.Item name="comment" label="Комментарий">
          <Input.TextArea placeholder="Примечания к посылке" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
