import { Layout, Menu, Button, Drawer, Grid, Typography, Image, Dropdown } from "antd";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Landing from "./pages/Landing";
import api from "./api";
import AppFooter from "./feautures/landing/components/Footer";

const { useBreakpoint } = Grid;

export default function App() {
  const { pathname } = useLocation();
  const screens = useBreakpoint();
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<any>(undefined);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "ru"; // fallback

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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  const languageMenu = [
    { key: "uz", label: "Oʻzbekcha", onClick: () => changeLanguage("uz") },
    { key: "en", label: "English", onClick: () => changeLanguage("en") },
    { key: "ru", label: "Русский", onClick: () => changeLanguage("ru") },
  ];

  const mainMenu = [
    { key: "/", label: <Link to="/">{t("home")}</Link> },
    { key: "flights", label: <a href="#flights">{t("flights")}</a> },
    { key: "how-it-works", label: <a href="#how-it-works">{t("howItWorks.title")}</a> },
    { key: "services", label: <a href="#services">{t("services.title")}</a> },
  ];

  return (
    <div style={{ backgroundColor: "#f5f5f5" }}>
      <Layout style={{ minHeight: "100vh" }} className="max-w-7xl mx-auto">
        {!(pathname.startsWith("/profile") || pathname.startsWith("/admin")) && (
          <Layout.Header className="flex items-center justify-between" style={{ backgroundColor: "#f5f5f5" }}>
            <Typography.Title level={3} className="!text-black !mb-0">
              <Image style={{ height: 50 }} src="/logo.png" alt="Logo" aria-disabled />
            </Typography.Title>
            {screens.md ? (
              <div className="flex items-center gap-4">
                <Menu style={{ background: "#f5f5f5" }} mode="horizontal" selectedKeys={[pathname]} items={mainMenu} />
                <Dropdown menu={{ items: languageMenu }} placement="bottomRight">
                  <Button>{currentLang.toUpperCase()}</Button>
                </Dropdown>
                {me ? (
                  <div className="flex items-center gap-2 text-black">
                    <span>{me.name}</span>
                    <Button onClick={logout}>{t("logout")}</Button>
                  </div>
                ) : (
                  <div className="space-x-2">
                    <Link to="https://my.airexpress.uz/auth?tab=login">
                      <Button>{t("login")}</Button>
                    </Link>
                    <Link to="https://my.airexpress.uz/auth?tab=register">
                      <Button type="primary">{t("register")}</Button>
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
