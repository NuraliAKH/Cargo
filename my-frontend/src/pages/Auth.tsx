import { Tabs, Form, Input, Button, message, Card } from "antd";
import api from "../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Auth({ onAuth }: { onAuth?: () => void }) {
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const start = sp.get("tab") || "login";

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [registerData, setRegisterData] = useState<{ phone: string; password: string; name: string } | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // ЛОГИН (без кода)
  const login = async (v: any) => {
    try {
      const { data } = await api.post("/api/auth/login", v);
      localStorage.setItem("token", data.access_token);
      message.success("Вход выполнен");
      onAuth?.();
      nav("/");
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Ошибка входа");
    }
  };

  // РЕГИСТРАЦИЯ: шаг 1 — отправка кода
  const startRegistration = async (v: any) => {
    try {
      await api.post("/api/auth/register", v);
      setRegisterData(v);
      setIsCodeSent(true);
      setCooldown(60);
      message.success("Код отправлен на номер");
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Ошибка");
    }
  };

  // РЕГИСТРАЦИЯ: шаг 2 — подтверждение кода
  const confirmRegistration = async (v: any) => {
    if (!registerData) return;
    try {
      const { data } = await api.post("/api/auth/verify", { phone: registerData.phone, code: v.code });
      localStorage.setItem("token", data.access_token);
      message.success("Регистрация выполнена");
      onAuth?.();
      nav("/");
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Неверный код");
    }
  };

  const renderLogin = () => (
    <Form layout="vertical" onFinish={login}>
      <Form.Item
        name="phone"
        label="Телефон"
        rules={[
          { required: true, message: "Введите номер телефона" },
          { pattern: /^\+?[0-9]{10,15}$/, message: "Некорректный номер" },
        ]}
      >
        <Input placeholder="+998901234567" />
      </Form.Item>
      <Form.Item name="password" label="Пароль" rules={[{ required: true, message: "Введите пароль" }]}>
        <Input.Password />
      </Form.Item>
      <Button type="primary" htmlType="submit" className="w-full">
        Войти
      </Button>
    </Form>
  );

  const renderRegister = () =>
    !isCodeSent ? (
      <Form layout="vertical" onFinish={startRegistration}>
        <Form.Item name="name" label="Имя" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Телефон"
          rules={[
            { required: true, message: "Введите номер телефона" },
            { pattern: /^\+?[0-9]{10,15}$/, message: "Некорректный номер" },
          ]}
        >
          <Input placeholder="+998901234567" />
        </Form.Item>
        <Form.Item name="password" label="Пароль" rules={[{ required: true, message: "Введите пароль" }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
          Получить код
        </Button>
      </Form>
    ) : (
      <Form layout="vertical" onFinish={confirmRegistration}>
        <Form.Item name="code" label="Код из SMS" rules={[{ required: true, message: "Введите код" }]}>
          <Input />
        </Form.Item>
        <div className="flex justify-between mb-2">
          <Button type="link" disabled={cooldown > 0} onClick={() => registerData && startRegistration(registerData)}>
            {cooldown > 0 ? `Отправить повторно (${cooldown}с)` : "Отправить повторно"}
          </Button>
        </div>
        <Button type="primary" htmlType="submit" className="w-full">
          Подтвердить
        </Button>
      </Form>
    );

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <Tabs
          defaultActiveKey={start}
          items={[
            { key: "login", label: "Войти", children: renderLogin() },
            { key: "register", label: "Регистрация", children: renderRegister() },
          ]}
        />
      </Card>
    </div>
  );
}
