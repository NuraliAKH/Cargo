import { Layout, Button, Grid, Typography, Image, Space, Select } from "antd";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import api from "./api";
import { PrivateRoute, RoleRoute } from "./routes/PrivateRoute";
import { Option } from "antd/es/mentions";
import { useTranslation } from "react-i18next";
import { GlobalOutlined } from "@ant-design/icons";
const { useBreakpoint } = Grid;

export default function App() {
  const { pathname } = useLocation();
  const screens = useBreakpoint();
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const [me, setMe] = useState<any>(undefined);
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };
  const nav = useNavigate();
  const loadMe = async () => {
    try {
      const { data } = await api.get("https://my.airexpress.uz/api/auth/me");
      setMe(data);
    } catch {
      setMe(null);
    }
  };
  useEffect(() => {
    loadMe();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setMe(null);
    nav("/");
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5" }}>
      <Layout style={{ minHeight: "100vh" }}>
        {/* Отображаем Header только для главной */}
        {!(pathname.startsWith("/") || pathname.startsWith("/admin")) && (
          <Layout.Header className="flex items-center justify-between" style={{ backgroundColor: "#f5f5f5" }}>
            <Typography.Title level={3} className="!text-black !mb-0">
              <img style={{ height: 50 }} src="/logo.png" alt="Logo" />
            </Typography.Title>
            {screens.md ? (
              <div className="flex items-center gap-4">
                {me ? (
                  <div className="flex items-center gap-0 text-black">
                    <div className="flex flex-col leading-tight">
                      <span className="font-medium">{me.name}</span>
                      <span className="text-xs text-gray-500">{me.id}</span>
                    </div>
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
                    <Button onClick={logout}>Выйти</Button>
                  </div>
                ) : (
                  <div className="space-x-2">
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
                    <Link to="/auth?tab=login">
                      <Button>Войти</Button>
                    </Link>
                    <Link to="/auth?tab=register">
                      <Button type="primary">Зарегистрироваться</Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Button onClick={() => setOpen(true)}>Меню</Button>
            )}
          </Layout.Header>
        )}

        <Layout.Content>
          <Routes>
            <Route path="/auth" element={<Auth onAuth={loadMe} />} />
            <Route
              path="/"
              element={
                <PrivateRoute me={me}>
                  <Profile me={me} />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <RoleRoute me={me} role="ADMIN">
                  <Admin />
                </RoleRoute>
              }
            />
          </Routes>
        </Layout.Content>
      </Layout>
    </div>
  );
}
