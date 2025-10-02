import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, message, InputNumber } from "antd";
import api from "../../../api";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function AddParcelModal({ open, onClose, onCreated }: Props) {
  const { t } = useTranslation();
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
        status: "AWAITING_AT_WAREHOUSE",
      });
      message.success(t("my-parcels.added"));
      form.resetFields();
      onCreated();
      onClose();
    } catch (e) {
      message.error(t("my-parcels.add_error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={t("my-parcels.add_modal_title")}
      open={open}
      onCancel={onClose}
      okText={t("my-parcels.save")}
      confirmLoading={submitting}
      onOk={() => form.submit()}
      destroyOnClose
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          name="trackCode"
          label={t("my-parcels.track_code")}
          rules={[{ required: true, message: t("my-parcels.errors.track_code") }]}
        >
          <Input placeholder={t("my-parcels.track_placeholder")} />
        </Form.Item>

        <Form.Item name="description" label={t("my-parcels.comment")}>
          <Input.TextArea placeholder={t("my-parcels.comment_placeholder")} />
        </Form.Item>

        <Form.Item
          name="price"
          label={t("my-parcels.price")}
          rules={[{ required: true, message: t("my-parcels.errors.price") }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
        </Form.Item>

        <Form.Item
          name="recipientId"
          label={t("my-parcels.recipient")}
          rules={[{ required: true, message: t("my-parcels.errors.recipient") }]}
        >
          <Select
            placeholder={t("my-parcels.select_recipient")}
            options={recipients.map((r: any) => ({
              value: r.id ?? r._id,
              label: `${r.lastName} ${r.firstName}`,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="warehouseId"
          label={t("my-parcels.warehouse")}
          rules={[{ required: true, message: t("my-parcels.errors.warehouse") }]}
        >
          <Select
            allowClear
            placeholder={t("my-parcels.select_warehouse")}
            options={warehouses.map((w: any) => ({
              value: w.id ?? w._id,
              label: w.name,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
