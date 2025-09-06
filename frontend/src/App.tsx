import { Layout, Menu, Button, Drawer, Grid, Typography, Image } from "antd";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Landing from "./pages/Landing";
import api from "./api";
import AppFooter from "./feautures/landing/components/Footer";

const { useBreakpoint } = Grid;

export default function App() {
  const { pathname } = useLocation();
  const screens = useBreakpoint();
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<any>(undefined);
  const nav = useNavigate();
  const loadMe = async () => {
    try {
      const { data } = await api.get("/api/auth/me");
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

  // Для Landing
  const mainMenu = [
    { key: "/", label: <Link to="/">Главная</Link> },
    { key: "flights", label: <a href="#flights">Рейсы</a> },
    { key: "how-it-works", label: <a href="#how-it-works">Как это работает</a> },
    { key: "services", label: <a href="#services">Услуги</a> },
  ];

  return (
    <div style={{ backgroundColor: "#f5f5f5" }}>
      <Layout style={{ minHeight: "100vh" }} className="max-w-7xl mx-auto">
        {/* Отображаем Header только для главной */}
        {!(pathname.startsWith("/profile") || pathname.startsWith("/admin")) && (
          <Layout.Header className="flex items-center justify-between" style={{ backgroundColor: "#f5f5f5" }}>
            <Typography.Title level={3} className="!text-black !mb-0">
              <Image style={{ height: 50 }} src="/logo.png" alt="Logo" />
            </Typography.Title>
            {screens.md ? (
              <div className="flex items-center gap-4">
                <Menu style={{ background: "#f5f5f5" }} mode="horizontal" selectedKeys={[pathname]} items={mainMenu} />
                {me ? (
                  <div className="flex items-center gap-2 text-black">
                    <span>{me.name}</span>
                    <Button onClick={logout}>Выйти</Button>
                  </div>
                ) : (
                  <div className="space-x-2">
                    <Link to="http://localhost:5174/auth?tab=login">
                      <Button>Войти</Button>
                    </Link>
                    <Link to="http://localhost:5174//auth?tab=register">
                      <Button type="primary">Зарегистрироваться</Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Button onClick={() => setOpen(true)}>Меню</Button>
            )}
            <Drawer open={open} onClose={() => setOpen(false)} title="Навигация">
              <Menu mode="inline" selectedKeys={[pathname]} items={mainMenu} onClick={() => setOpen(false)} />
            </Drawer>
          </Layout.Header>
        )}

        <Layout.Content>
          <Routes>
            <Route path="/" element={<Landing />} />
          </Routes>
        </Layout.Content>

        <Layout.Footer className="text-center">
          <AppFooter />
        </Layout.Footer>
      </Layout>
    </div>
  );
}
