import { useEffect, useState } from "react";
import api from "../../../api";
import { Button, Card, List, message, Popconfirm, Segmented, Tag, Typography, Space, Grid } from "antd";
import AddParcelModal from "./AddParcelModal";
import {
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  InboxOutlined,
  ShopOutlined,
  AppstoreOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Text } = Typography;
const { useBreakpoint } = Grid;

export function Parcels() {
  const { t } = useTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [openAdd, setOpenAdd] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const screens = useBreakpoint();

  const statusIcons: Record<string, { icon: JSX.Element; color: string }> = {
    AWAITING_AT_WAREHOUSE: { icon: <ClockCircleOutlined />, color: "default" },
    AT_WAREHOUSE: { icon: <InboxOutlined />, color: "blue" },
    IN_TRANSIT: { icon: <CarOutlined />, color: "orange" },
    AT_LOCAL_WAREHOUSE: { icon: <ShopOutlined />, color: "cyan" },
    WITH_COURIER: { icon: <UserOutlined />, color: "purple" },
    DELIVERED: { icon: <CheckCircleOutlined />, color: "green" },
  };

  const statusOptions = [
    { label: t("parcels.all"), value: "ALL", icon: <AppstoreOutlined /> },
    {
      label: t("parcels.statuses.AWAITING_AT_WAREHOUSE"),
      value: "AWAITING_AT_WAREHOUSE",
      icon: <ClockCircleOutlined />,
    },
    { label: t("parcels.statuses.AT_WAREHOUSE"), value: "AT_WAREHOUSE", icon: <InboxOutlined /> },
    { label: t("parcels.statuses.IN_TRANSIT"), value: "IN_TRANSIT", icon: <CarOutlined /> },
    { label: t("parcels.statuses.AT_LOCAL_WAREHOUSE"), value: "AT_LOCAL_WAREHOUSE", icon: <ShopOutlined /> },
    { label: t("parcels.statuses.WITH_COURIER"), value: "WITH_COURIER", icon: <UserOutlined /> },
    { label: t("parcels.statuses.DELIVERED"), value: "DELIVERED", icon: <CheckCircleOutlined /> },
  ];

  const load = () => api.get("/api/parcels/my").then(r => setItems(r.data));

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id: number) => {
    try {
      await api.delete(`/api/parcels/${id}`);
      message.success(t("parcels.deleteSuccess"));
      load();
    } catch {
      message.error(t("parcels.deleteError"));
    }
  };

  const filtered = filter ? items.filter(p => p.status === filter) : items;

  const headerContent = (
    <Space
      direction="vertical"
      style={{
        width: "100%",
        justifyContent: screens.xs ? "flex-start" : "flex-end",
        alignItems: screens.xs ? "stretch" : "center",
      }}
    >
      {screens.xs ? (
        <>
          <Button icon={<FilterOutlined />} onClick={() => setShowFilters(prev => !prev)} block>
            {showFilters ? t("parcels.hideFilters") : t("parcels.showFilters")}
          </Button>

          {showFilters && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
              <Segmented
                size={screens.xs ? "small" : "middle"}
                block={screens.xs}
                options={statusOptions.map(o => ({
                  value: o.value,
                  label: <Space>{o.icon}</Space>,
                }))}
                onChange={(v: any) => setFilter(v === "ALL" ? undefined : v)}
              />
            </div>
          )}

          <Button type="primary" onClick={() => setOpenAdd(true)} block>
            {t("parcels.add")}
          </Button>
        </>
      ) : (
        <Space>
          <Segmented
            size={screens.xs ? "small" : "middle"}
            block={screens.xs}
            options={statusOptions.map(o => ({
              value: o.value,
              label: <Space>{o.icon}</Space>,
            }))}
            onChange={(v: any) => setFilter(v === "ALL" ? undefined : v)}
          />
          <Button type="primary" onClick={() => setOpenAdd(true)}>
            {t("parcels.add")}
          </Button>
        </Space>
      )}
    </Space>
  );

  return (
    <Card
      title={t("parcels.title")}
      extra={headerContent}
      style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
    >
      <List
        dataSource={filtered}
        itemLayout="vertical"
        renderItem={(p: any) => {
          const id = p.id ?? p._id;
          const canDelete = p.status === "AWAITING_AT_WAREHOUSE";

          return (
            <Card
              key={id}
              style={{
                marginBottom: 12,
                borderRadius: 10,
                border: "1px solid #f0f0f0",
              }}
              bodyStyle={{
                display: "flex",
                flexDirection: screens.xs ? "column" : "row",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <Text strong>{p.trackCode}</Text> — {p.description}
                <div style={{ marginTop: 8 }}>
                  <div>
                    <Text type="secondary">{t("parcels.price")}:</Text> {p.price} $
                  </div>
                  {p.recipient && (
                    <div>
                      <Text type="secondary">{t("parcels.recipient")}:</Text>{" "}
                      {`${p.recipient.lastName} ${p.recipient.firstName}`}
                    </div>
                  )}
                  {p.flight && (
                    <div>
                      <Text type="secondary">{t("parcels.flight")}:</Text> {p.flight.code ?? t("parcels.noFlight")}
                    </div>
                  )}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  alignItems: screens.xs ? "flex-start" : "flex-end",
                }}
              >
                {(() => {
                  const s = statusIcons[p.status];
                  return (
                    <Tag color={s?.color || "default"} icon={s?.icon}>
                      {t(`parcels.statuses.${p.status}`, { defaultValue: p.status }) as string}
                    </Tag>
                  );
                })()}
                {canDelete && (
                  <Popconfirm
                    title={t("parcels.confirmDelete")}
                    okText={t("parcels.yes")}
                    cancelText={t("parcels.no")}
                    onConfirm={() => onDelete(id)}
                  >
                    <Button danger size="small">
                      {t("parcels.delete")}
                    </Button>
                  </Popconfirm>
                )}
              </div>
            </Card>
          );
        }}
      />
      <AddParcelModal open={openAdd} onClose={() => setOpenAdd(false)} onCreated={load} />
    </Card>
  );
}
