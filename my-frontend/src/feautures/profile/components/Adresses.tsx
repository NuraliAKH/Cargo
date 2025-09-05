import { useEffect, useState } from "react";
import api from "../../../api";
import { Button, Card, Form, Input, List, message } from "antd";

export function Addresses() {
  const [items, setItems] = useState<any[]>([]);
  const load = () => api.get("/api/addresses/my").then(r => setItems(r.data));
  useEffect(() => {
    load();
  }, []);
  const onFinish = async (v: any) => {
    await api.post("/api/addresses", v);
    message.success("Адрес добавлен");
    load();
  };
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title="Мои адреса">
        <List
          dataSource={items}
          renderItem={(a: any) => (
            <List.Item>
              <List.Item.Meta
                title={a.label}
                description={`${a.line1}${a.line2 ? ", " + a.line2 : ""}, ${a.city}, ${a.country}`}
              />
            </List.Item>
          )}
        />
      </Card>
      <Card title="Добавить адрес">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="label" label="Название" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="line1" label="Адрес 1" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="line2" label="Адрес 2">
            <Input />
          </Form.Item>
          <Form.Item name="city" label="Город" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="country" label="Страна" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Сохранить
          </Button>
        </Form>
      </Card>
    </div>
  );
}
