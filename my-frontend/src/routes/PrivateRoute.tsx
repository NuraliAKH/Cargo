import { Navigate, useNavigate } from "react-router-dom";

export function PrivateRoute({ me, children }: { me: any; children: React.ReactNode }) {
  const nav = useNavigate();

  if (me === undefined) return <div>Загрузка...</div>; // или спиннер
  if (!me) {
    nav("/auth?tab=login");
    return null;
  }

  return <>{children}</>;
}

export function RoleRoute({ children, me, role }: { children: JSX.Element; me: any; role: string }) {
  if (me === undefined) return <div>Загрузка...</div>;
  return me && me.role === role ? children : <Navigate to="/" />;
}
