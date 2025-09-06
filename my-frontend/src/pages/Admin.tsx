import { Tabs, Typography } from "antd";
import { useTranslation } from "react-i18next";
import UsersTable from "../feautures/admin/components/UsersTable";
import ParcelsTable from "../feautures/admin/components/ParcelsTable";
import AddressesTable from "../feautures/admin/components/AddressesTable";
import FlightsPage from "../feautures/admin/components/FlightsPage";

export default function AdminPanel() {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto md:p-0 p-4">
      <Typography.Title level={2}>{t("admin.title")}</Typography.Title>
      <Tabs
        defaultActiveKey="parcels"
        items={[
          { key: "users", label: t("admin.tabs.users"), children: <UsersTable /> },
          { key: "parcels", label: t("admin.tabs.parcels"), children: <ParcelsTable /> },
          { key: "addresses", label: t("admin.tabs.addresses"), children: <AddressesTable /> },
          { key: "flights", label: t("admin.tabs.flights"), children: <FlightsPage /> },
        ]}
      />
    </div>
  );
}
