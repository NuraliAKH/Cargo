import { Tabs, Form, Input, Button, message, Card } from "antd";
import api from "../api";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Auth({ onAuth }: { onAuth?: () => void }) {
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const start = sp.get("tab") || "login";

  const login = async (v: any) => {
    try {
      const { data } = await api.post("/api/auth/login", v);

      localStorage.setItem("token", data.access_token);
      message.success("Вход выполнен");
      onAuth();
      nav("/");
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Ошибка");
    }
  };
  const register = async (v: any) => {
    try {
      const { data } = await api.post("/api/auth/register", v);
      localStorage.setItem("token", data.access_token);
      message.success("Регистрация выполнена");
      onAuth?.();
      nav("/");
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Ошибка");
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-xl">
        <Tabs
          defaultActiveKey={start}
          items={[
            {
              key: "login",
              label: "Войти",
              children: (
                <Form layout="vertical" onFinish={login}>
                  <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="password" label="Пароль" rules={[{ required: true }]}>
                    <Input.Password />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" className="w-full">
                    Войти
                  </Button>
                </Form>
              ),
            },
            {
              key: "register",
              label: "Регистрация",
              children: (
                <Form layout="vertical" onFinish={register}>
                  <Form.Item name="name" label="Имя" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="password" label="Пароль" rules={[{ required: true, min: 6 }]}>
                    <Input.Password />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" className="w-full">
                    Создать аккаунт
                  </Button>
                </Form>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
