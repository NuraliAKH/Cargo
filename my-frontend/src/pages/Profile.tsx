import { Button, Layout, Menu, Select, Space, Grid, Drawer, Avatar, Tooltip } from "antd";
import { useState } from "react";
import {
  HomeOutlined,
  InboxOutlined,
  EnvironmentOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined,
  MenuOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Warehouses } from "../feautures/profile/components/WareHouse";
import { Parcels } from "../feautures/profile/components/Percels";
import { Addresses } from "../feautures/profile/components/Adresses";
import RecipientTable from "../feautures/profile/components/RecipientTable";
import FlightsList from "../feautures/profile/components/FlightsChess";
import { Header } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

const { Sider, Content } = Layout;
const { Option } = Select;

const SiderWrapper = styled.div`
  .ant-layout-sider {
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
  }

  .ant-menu {
    border: none !important;
    background: transparent;
  }

  .ant-menu-item {
    margin: 8px 8px !important;
    border-radius: 8px !important;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(24, 144, 255, 0.1) !important;
    }
  }

  .ant-menu-item-selected {
    background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%) !important;
    color: white !important;

    .ant-menu-title-content {
      color: white !important;
      font-weight: 600;
    }
  }

  .ant-menu-inline-collapsed {
    width: 80px;

    .ant-menu-item {
      text-align: center;
      padding-left: 0 !important;
    }
  }
`;

const HeaderWrapper = styled.div`
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid #f0f0f0;
  padding: 12px 16px;

  @media (max-width: 576px) {
    padding: 8px 12px;
  }

  .header-user {
    display: flex;
    align-items: center;
    gap: 12px;

    .user-info {
      display: flex;
      flex-direction: column;
      justify-content: center;

      @media (max-width: 576px) {
        display: none;
      }

      .user-name {
        font-weight: 600;
        color: #1890ff;
        margin: 0;
      }

      .user-id {
        font-size: 12px;
        color: #999;
        margin: 0;
      }
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;

    @media (max-width: 576px) {
      gap: 8px;
    }
  }
`;

const ContentWrapper = styled.div`
  background: #f5f5f5;
  min-height: 100vh;
  padding: 16px;

  @media (max-width: 768px) {
    padding: 12px;
  }

  @media (max-width: 576px) {
    padding: 8px;
  }
`;

export default function Profile(me: any) {
  const { t, i18n } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("warehouses");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const screens = Grid.useBreakpoint();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    nav("/auth?tab=login");
  };

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

  const menuItems = [
    { key: "warehouses", label: t("profile.menu.warehouses"), icon: <HomeOutlined /> },
    { key: "parcels", label: t("profile.menu.parcels"), icon: <InboxOutlined /> },
    { key: "addresses", label: t("profile.menu.addresses"), icon: <EnvironmentOutlined /> },
    { key: "recipient", label: t("profile.menu.recipient"), icon: <EnvironmentOutlined /> },
    { key: "flights", label: t("profile.menu.flights"), icon: <MenuUnfoldOutlined /> },
  ];

  const handleMenuClick = (key: string) => {
    setSelectedKey(key);
    setDrawerVisible(false);
  };

  return (
    <Layout className="min-h-screen" style={{ background: "#f5f5f5" }}>
      {/* Desktop Sidebar */}
      {!screens.xs && !screens.sm && (
        <SiderWrapper>
          <Sider
            width={250}
            collapsedWidth={80}
            collapsed={collapsed}
            onCollapse={setCollapsed}
            trigger={null}
            className="shadow-md"
            style={{
              background: "#f5f5f5",
              borderRight: "1px solid #f0f0f0",
              position: "sticky",
              top: 0,
              left: 0,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <div
              style={{
                padding: "8px 0",
                textAlign: "center",
                minHeight: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                type="text"
                icon={collapsed ? <MenuOutlined /> : <MenuUnfoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: 18, width: 40, height: 40 }}
              />
            </div>
            <Menu
              style={{
                background: "#f5f5f5",
                border: "none",
              }}
              mode="inline"
              inlineCollapsed={collapsed}
              selectedKeys={[selectedKey]}
              onClick={e => setSelectedKey(e.key)}
              items={menuItems}
            />
          </Sider>
        </SiderWrapper>
      )}

      {/* Mobile Drawer */}
      {(screens.xs || screens.sm) && (
        <Drawer
          title={t("common.menu")}
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          bodyStyle={{ padding: 0 }}
        >
          <Menu mode="inline" selectedKeys={[selectedKey]} onClick={e => handleMenuClick(e.key)} items={menuItems} />
        </Drawer>
      )}

      <Layout>
        <Header
          className="flex items-center justify-between"
          style={{
            backgroundColor: "#f5f5f5",
            padding: screens.xs ? "0 8px" : "0 16px",
            height: screens.xs ? "auto" : "64px",
            lineHeight: screens.xs ? "normal" : "64px",
          }}
        >
          <Space size={screens.xs ? "small" : "middle"} style={{ flex: 1 }}>
            {(screens.xs || screens.sm) && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerVisible(true)}
                style={{ fontSize: 18 }}
              />
            )}
            {me && (
              <div className="flex flex-col leading-tight">
                <span className="font-medium" style={{ fontSize: screens.xs ? 12 : 14 }}>
                  {me.me.name}
                </span>
                <span style={{ fontSize: screens.xs ? 10 : 12, color: "#999" }}>ID: {me.me.id}</span>
              </div>
            )}
          </Space>

          <Space size={screens.xs ? "small" : "middle"}>
            <Select
              defaultValue={i18n.language}
              style={{ width: screens.xs ? 90 : 120 }}
              onChange={changeLanguage}
              suffixIcon={<GlobalOutlined />}
              size={screens.xs ? "small" : "middle"}
            >
              <Option value="ru">Русский</Option>
              <Option value="uz">Oʻzbekcha</Option>
              <Option value="en">English</Option>
            </Select>
            <Button onClick={logout} size={screens.xs ? "small" : "middle"}>
              {t("common.logout")}
            </Button>
          </Space>
        </Header>
        <Content
          style={{
            width: "100%",
            padding: screens.xs ? "8px" : screens.sm ? "12px" : "16px",
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}
