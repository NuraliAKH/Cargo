import { useEffect, useState } from "react";
import api from "../../../api";
import { Button, Card, Form, Input, List, message, Popconfirm } from "antd";
import { useTranslation } from "react-i18next";

export function Addresses() {
  const { t } = useTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/addresses/my");
      setItems(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onFinish = async (v: any) => {
    try {
      setSubmitting(true);
      await api.post("/api/addresses", v);
      message.success(t("addresses.msgAddSuccess"));
      load();
    } catch {
      message.error(t("addresses.msgAddError"));
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/api/addresses/${id}`);
      message.success(t("addresses.msgDeleteSuccess"));
      load();
    } catch {
      message.error(t("addresses.msgDeleteError"));
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title={t("addresses.titleMy")} loading={loading}>
        <List
          dataSource={items}
          renderItem={(a: any) => (
            <List.Item
              actions={[
                <Popconfirm
                  key="delete"
                  title={t("addresses.confirmDelete")}
                  onConfirm={() => remove(a.id ?? a._id)}
                  okText={t("common.yes")}
                  cancelText={t("common.no")}
                >
                  <Button danger size="small">
                    {t("common.delete")}
                  </Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={a.label}
                description={`${a.line1}${a.line2 ? ", " + a.line2 : ""}, ${a.city}, ${a.country}`}
              />
            </List.Item>
          )}
        />
      </Card>
      <Card title={t("addresses.titleAdd")}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="label"
            label={t("addresses.fieldLabel")}
            rules={[{ required: true, message: t("addresses.errLabel") }]}
          >
            <Input placeholder={t("addresses.phLabel")} />
          </Form.Item>
          <Form.Item
            name="line1"
            label={t("addresses.fieldLine1")}
            rules={[{ required: true, message: t("addresses.errLine1") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="line2" label={t("addresses.fieldLine2")}>
            <Input />
          </Form.Item>
          <Form.Item
            name="city"
            label={t("addresses.fieldCity")}
            rules={[{ required: true, message: t("addresses.errCity") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="country"
            label={t("addresses.fieldCountry")}
            rules={[{ required: true, message: t("addresses.errCountry") }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            {t("common.save")}
          </Button>
        </Form>
      </Card>
    </div>
  );
}
