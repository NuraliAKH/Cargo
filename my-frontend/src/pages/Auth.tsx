import { Tabs, Form, Input, Button, message, Card, Checkbox, Space, Select } from "antd";
import api from "../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GlobalOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
export default function Auth({ onAuth }: { onAuth?: () => void }) {
  const { t, i18n } = useTranslation();
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const start = sp.get("tab") || "login";
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

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

  const login = async (v: any) => {
    try {
      const { data } = await api.post("https://my.airexpress.uz/api/auth/login", v);
      localStorage.setItem("token", data.access_token);
      message.success(t("auth.loginSuccess"));
      onAuth?.();
      nav("/");
    } catch (e: any) {
      message.error(e?.response?.data?.message || t("auth.loginError"));
    }
  };

  const startRegistration = async (v: any) => {
    try {
      await api.post("https://my.airexpress.uz/api/auth/register", v);
      setRegisterData(v);
      setIsCodeSent(true);
      setCooldown(60);
      message.success(t("auth.codeSent"));
    } catch (e: any) {
      message.error(e?.response?.data?.message || t("auth.error"));
    }
  };

  const confirmRegistration = async (v: any) => {
    if (!registerData) return;
    try {
      const { data } = await api.post("https://my.airexpress.uz/api/auth/verify", {
        phone: registerData.phone,
        code: v.code,
      });
      localStorage.setItem("token", data.access_token);
      message.success(t("auth.registerSuccess"));
      onAuth?.();
      nav("/");
    } catch (e: any) {
      message.error(e?.response?.data?.message || t("auth.invalidCode"));
    }
  };

  const renderLogin = () => (
    <Form layout="vertical" onFinish={login}>
      <Form.Item
        name="phone"
        label={t("auth.phone")}
        rules={[
          { required: true, message: t("auth.phoneRequired") },
          { pattern: /^\+?[0-9]{10,15}$/, message: t("auth.phoneInvalid") },
        ]}
      >
        <Input placeholder="+998901234567" />
      </Form.Item>
      <Form.Item
        name="password"
        label={t("auth.password")}
        rules={[{ required: true, message: t("auth.passwordRequired") }]}
      >
        <Input.Password />
      </Form.Item>
      <Button type="primary" htmlType="submit" className="w-full">
        {t("auth.login")}
      </Button>
    </Form>
  );

  const renderRegister = () =>
    !isCodeSent ? (
      <Form layout="vertical" onFinish={startRegistration}>
        <Form.Item name="name" label={t("auth.name")} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label={t("auth.phone")}
          rules={[
            { required: true, message: t("auth.phoneRequired") },
            { pattern: /^\+?[0-9]{10,15}$/, message: t("auth.phoneInvalid") },
          ]}
        >
          <Input placeholder="+998901234567" />
        </Form.Item>
        <Form.Item
          name="password"
          label={t("auth.password")}
          rules={[{ required: true, message: t("auth.passwordRequired") }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="offerAgreement"
          valuePropName="checked"
          rules={[{ required: true, message: t("auth.offerRequired") }]}
        >
          <Checkbox>
            Я подтверждаю, что ознакомлен(-на) с{" "}
            <a href="/offer.pdf" target="_blank" rel="noopener noreferrer" style={{ color: "#2291e3" }}>
              публичной офертой
            </a>{" "}
            и{" "}
            <a href="/privacy.pdf" target="_blank" rel="noopener noreferrer" style={{ color: "#2291e3" }}>
              политикой конфиденциальности
            </a>
            , и принимаю их положения.
          </Checkbox>
        </Form.Item>
        <Form.Item
          name="marketingAgreement"
          valuePropName="checked"
          rules={[{ required: true, message: t("auth.marketingRequired") }]}
        >
          <Checkbox>
            Я согласен(-на) получать от AirExpress сообщения средствами электронной связи (email, SMS),
            персонализированные маркетинговые материалы, включая предложения на основе моих покупательских предпочтений.
          </Checkbox>
        </Form.Item>

        <Button type="primary" htmlType="submit" className="w-full">
          {t("auth.getCode")}
        </Button>
      </Form>
    ) : (
      <Form layout="vertical" onFinish={confirmRegistration}>
        <Form.Item name="code" label={t("auth.smsCode")} rules={[{ required: true, message: t("auth.enterCode") }]}>
          <Input />
        </Form.Item>
        <div className="flex justify-between mb-2">
          <Button type="link" disabled={cooldown > 0} onClick={() => registerData && startRegistration(registerData)}>
            {cooldown > 0 ? t("auth.resendCooldown", { seconds: cooldown }) : t("auth.resend")}
          </Button>
        </div>

        <Button type="primary" htmlType="submit" className="w-full">
          {t("auth.confirm")}
        </Button>
      </Form>
    );

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <Space direction="vertical" style={{ width: "100%", alignItems: "center" }}>
          <Select
            defaultValue={i18n.language}
            style={{ width: 120 }}
            onChange={changeLanguage}
            suffixIcon={<GlobalOutlined />}
          >
            <Option value="ru">Русский</Option>
            <Option value="uz">Oʻzbekcha</Option>
            <Option value="en">English</Option>
          </Select>
        </Space>
        <Tabs
          defaultActiveKey={start}
          items={[
            { key: "login", label: t("auth.loginTab"), children: renderLogin() },
            { key: "register", label: t("auth.registerTab"), children: renderRegister() },
          ]}
        />
      </Card>
    </div>
  );
}
