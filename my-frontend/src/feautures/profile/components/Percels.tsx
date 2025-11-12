import { useEffect, useState } from "react";
import api from "../../../api";
import { Button, Card, message, Popconfirm, Segmented, Tag, Typography, Space, Grid } from "antd";
import AddParcelModal from "./AddParcelModal";
import styled from "@emotion/styled";
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

/* === Styled Components === */
const ScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding-bottom: 8px;
  scroll-snap-type: x mandatory;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #d9d9d9;
    border-radius: 10px;
  }
`;

const StyledCard = styled(Card)`
  min-width: 280px;
  flex: 0 0 auto;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
  scroll-snap-align: start;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
`;

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
    ...Object.entries(statusIcons).map(([key, val]) => ({
      label: t(`parcels.statuses.${key}`),
      value: key,
      icon: val.icon,
    })),
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
          <Button icon={<FilterOutlined />} onClick={() => setShowFilters(p => !p)} block>
            {showFilters ? t("parcels.hideFilters") : t("parcels.showFilters")}
          </Button>

          {showFilters && (
            <Segmented
              size="small"
              block
              options={statusOptions.map(o => ({
                value: o.value,
                label: <Space>{o.icon}</Space>,
              }))}
              onChange={(v: any) => setFilter(v === "ALL" ? undefined : v)}
            />
          )}

          <Button type="primary" onClick={() => setOpenAdd(true)} block>
            {t("parcels.add")}
          </Button>
        </>
      ) : (
        <Space>
          <Segmented
            size="middle"
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
      <ScrollContainer>
        {filtered.map((p: any) => {
          const canDelete = p.status === "AWAITING_AT_WAREHOUSE";
          const s = statusIcons[p.status];

          return (
            <StyledCard key={p.id} bodyStyle={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div>
                <Text strong>{p.trackCode}</Text> — {p.description}
                <div style={{ marginTop: 6 }}>
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

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Tag color={s?.color || "default"} icon={s?.icon}>
                  {t(`parcels.statuses.${p.status}`, { defaultValue: p.status })}
                </Tag>

                {canDelete && (
                  <Popconfirm
                    title={t("parcels.confirmDelete")}
                    okText={t("parcels.yes")}
                    cancelText={t("parcels.no")}
                    onConfirm={() => onDelete(p.id)}
                  >
                    <Button danger size="small">
                      {t("parcels.delete")}
                    </Button>
                  </Popconfirm>
                )}
              </div>
            </StyledCard>
          );
        })}
      </ScrollContainer>

      <AddParcelModal open={openAdd} onClose={() => setOpenAdd(false)} onCreated={load} />
    </Card>
  );
}
