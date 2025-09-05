import { Layout, Menu, Button, Drawer, Grid, Typography, Image } from "antd";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import api from "./api";
import { PrivateRoute, RoleRoute } from "./routes/PrivateRoute";

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

  return (
    <div style={{ backgroundColor: "#f5f5f5" }}>
      <Layout style={{ minHeight: "100vh" }}>
        {/* Отображаем Header только для главной */}
        {!(pathname.startsWith("/profile") || pathname.startsWith("/admin")) && (
          <Layout.Header className="flex items-center justify-between" style={{ backgroundColor: "#f5f5f5" }}>
            <Typography.Title level={3} className="!text-black !mb-0">
              <Image style={{ height: 50 }} src="/logo.png" alt="Logo" />
            </Typography.Title>
            {screens.md ? (
              <div className="flex items-center gap-4">
                {me ? (
                  <div className="flex items-center gap-2 text-black">
                    <span>{me.name}</span>
                    <Button onClick={logout}>Выйти</Button>
                  </div>
                ) : (
                  <div className="space-x-2">
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
                  <Profile />
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
