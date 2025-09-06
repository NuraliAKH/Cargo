import { useEffect, useState } from "react";
import api from "../../../api";
import { Button, Card, List, message, Popconfirm, Segmented, Tag, Typography, Space, Grid } from "antd";
import AddParcelModal from "./AddParcelModal";
import { FilterOutlined } from "@ant-design/icons";
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
                size="small"
                block
                options={[
                  { label: t("parcels.all"), value: "ALL" },
                  ...Object.entries(t("parcels.statuses", { returnObjects: true })).map(([key, label]) => ({
                    label,
                    value: key,
                  })),
                ]}
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
            size="middle"
            options={[
              { label: t("parcels.all"), value: "ALL" },
              ...Object.entries(t("parcels.statuses", { returnObjects: true })).map(([key, label]) => ({
                label,
                value: key,
              })),
            ]}
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
                <Tag color="blue">{t(`parcels.statuses.${p.status}`, { defaultValue: p.status }) as string}</Tag>
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
