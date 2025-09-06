import { Layout, Menu, Select, Space } from "antd";
import { useState } from "react";
import {
  HomeOutlined,
  InboxOutlined,
  EnvironmentOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Warehouses } from "../feautures/profile/components/WareHouse";
import { Parcels } from "../feautures/profile/components/Percels";
import { Addresses } from "../feautures/profile/components/Adresses";
import RecipientTable from "../feautures/profile/components/RecipientTable";
import FlightsList from "../feautures/profile/components/FlightsChess";

const { Sider, Content } = Layout;
const { Option } = Select;

export default function Profile() {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("warehouses");

  const renderContent = () => {
    switch (selectedKey) {
      case "warehouses":
        return <Warehouses />;
      case "parcels":
        return <Parcels />;
      case "addresses":
        return <Addresses />;
      case "recipient":
        return <RecipientTable />;
      case "flights":
        return <FlightsList />;
      default:
        return <Warehouses />;
    }
  };

  return (
    <Layout className="min-h-screen" style={{ background: "#f5f5f5" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        className="shadow-md"
        style={{ background: "#f5f5f5", borderRight: "1px solid #f0f0f0" }}
      >
        <Menu
          style={{ background: "#f5f5f5" }}
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={e => setSelectedKey(e.key)}
          items={[
            { key: "warehouses", label: t("profile.menu.warehouses"), icon: <HomeOutlined /> },
            { key: "parcels", label: t("profile.menu.parcels"), icon: <InboxOutlined /> },
            { key: "addresses", label: t("profile.menu.addresses"), icon: <EnvironmentOutlined /> },
            { key: "recipient", label: t("profile.menu.recipient"), icon: <EnvironmentOutlined /> },
            { key: "flights", label: t("profile.menu.flights"), icon: <MenuUnfoldOutlined /> },
          ]}
        />
      </Sider>
      <Layout>
        <Content style={{ width: "100%" }}>{renderContent()}</Content>
      </Layout>
    </Layout>
  );
}
