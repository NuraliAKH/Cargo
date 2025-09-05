import { Tabs, Typography } from "antd";
import UsersTable from "../feautures/admin/components/UsersTable";
import ParcelsTable from "../feautures/admin/components/ParcelsTable";
import AddressesTable from "../feautures/admin/components/AddressesTable";
import FlightsPage from "../feautures/admin/components/FlightsPage";

export default function AdminPanel() {
  return (
    <div className="max-w-6xl mx-auto md:p-0 p-4">
      <Typography.Title level={2}>Админ-панель</Typography.Title>
      <Tabs
        defaultActiveKey="parcels"
        items={[
          { key: "users", label: "Пользователи", children: <UsersTable /> },
          { key: "parcels", label: "Посылки", children: <ParcelsTable /> },
          { key: "addresses", label: "Адреса", children: <AddressesTable /> },
          { key: "flights", label: "Рейсы", children: <FlightsPage /> },
        ]}
      />
    </div>
  );
}
