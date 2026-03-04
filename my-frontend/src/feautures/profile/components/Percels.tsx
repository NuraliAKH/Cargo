import { useEffect, useState } from "react";
import api from "../../../api";
import { Button, Card, message, Popconfirm, Segmented, Tag, Typography, Space, Grid, Empty } from "antd";
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const StyledCard = styled(Card)`
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .ant-card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  @media (max-width: 768px) {
    border-radius: 8px;
  }
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
      direction={screens.xs ? "vertical" : "horizontal"}
      style={{
        width: screens.xs ? "100%" : "auto",
      }}
      size="small"
    >
      {screens.xs ? (
        <>
          <Button icon={<FilterOutlined />} onClick={() => setShowFilters(p => !p)} block size="middle">
            {showFilters ? t("parcels.hideFilters") : t("parcels.showFilters")}
          </Button>

          {showFilters && (
            <Segmented
              block
              value={filter || "ALL"}
              options={statusOptions.map(o => ({
                value: o.value,
                icon: o.icon,
              }))}
              onChange={(v: any) => setFilter(v === "ALL" ? undefined : v)}
            />
          )}

          <Button type="primary" onClick={() => setOpenAdd(true)} block size="middle">
            {t("parcels.add")}
          </Button>
        </>
      ) : (
        <>
          <Segmented
            value={filter || "ALL"}
            options={statusOptions.map(o => ({
              value: o.value,
              icon: o.icon,
            }))}
            onChange={(v: any) => setFilter(v === "ALL" ? undefined : v)}
          />
          <Button type="primary" onClick={() => setOpenAdd(true)}>
            {t("parcels.add")}
          </Button>
        </>
      )}
    </Space>
  );

  return (
    <Card
      title={t("parcels.title")}
      extra={headerContent}
      style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      styles={{ body: { padding: screens.xs ? "12px" : "24px" } }}
    >
      {filtered.length === 0 ? (
        <Empty description={t("parcels.all")} />
      ) : (
        <ScrollContainer>
          {filtered.map((p: any) => {
            const canDelete = p.status === "AWAITING_AT_WAREHOUSE";
            const s = statusIcons[p.status];

            return (
              <StyledCard key={p.id} size="small">
                <Space direction="vertical" style={{ width: "100%" }} size="middle">
                  <div>
                    <Text strong style={{ fontSize: 16 }}>
                      {p.trackCode}
                    </Text>
                    <div style={{ marginTop: 4 }}>
                      <Text type="secondary" style={{ fontSize: 14 }}>
                        {p.description}
                      </Text>
                    </div>
                  </div>

                  <Space direction="vertical" size="small" style={{ width: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <Text type="secondary">{t("parcels.price")}:</Text>
                      <Text strong>${p.price}</Text>
                    </div>
                    {p.recipient && (
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Text type="secondary">{t("parcels.recipient")}:</Text>
                        <Text>{`${p.recipient.lastName} ${p.recipient.firstName}`}</Text>
                      </div>
                    )}
                    {p.flight && (
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Text type="secondary">{t("parcels.flight")}:</Text>
                        <Text>{p.flight.code ?? t("parcels.noFlight")}</Text>
                      </div>
                    )}
                  </Space>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: "auto" }}>
                    <Tag color={s?.color || "default"} icon={s?.icon} style={{ margin: 0, padding: "4px 8px" }}>
                      {t(`parcels.statuses.${p.status}`, { defaultValue: p.status })}
                    </Tag>

                    {canDelete && (
                      <Popconfirm
                        title={t("parcels.confirmDelete")}
                        okText={t("parcels.yes")}
                        cancelText={t("parcels.no")}
                        onConfirm={() => onDelete(p.id)}
                      >
                        <Button danger size="small" block>
                          {t("parcels.delete")}
                        </Button>
                      </Popconfirm>
                    )}
                  </div>
                </Space>
              </StyledCard>
            );
          })}
        </ScrollContainer>
      )}

      <AddParcelModal open={openAdd} onClose={() => setOpenAdd(false)} onCreated={load} />
    </Card>
  );
}
