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
const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledListItem = styled.div`
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fff;
  padding: 12px 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #1890ff;
    background: #fafbff;
  }

  /* Package Icon */
  .package-icon {
    font-size: 24px;
    min-width: 32px;
    text-align: center;
  }

  /* Track Code and Description */
  .track-info {
    flex: 1;
    min-width: 0;

    .track-code {
      font-size: 14px;
      font-weight: 700;
      color: #1890ff;
      font-family: "Monaco", "Courier New", monospace;
      display: block;
      margin-bottom: 4px;
    }

    .parcel-description {
      font-size: 12px;
      color: #8c8c8c;
      line-height: 1.3;
      word-break: break-word;
      max-height: 36px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  /* Middle Column - Details */
  .middle-info {
    display: flex;
    gap: 20px;
    flex: 1;
    min-width: 250px;

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .label {
        font-size: 11px;
        color: #8c8c8c;
        text-transform: uppercase;
        font-weight: 500;
        letter-spacing: 0.5px;
      }

      .value {
        font-size: 13px;
        font-weight: 600;
        color: #262626;
      }
    }
  }

  /* Price Column */
  .price-column {
    min-width: 100px;
    background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
    border-radius: 8px;
    padding: 8px 12px;
    border: 1px solid #91d5ff;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .price-label {
      font-size: 10px;
      color: #0050b3;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 4px;
      letter-spacing: 0.5px;
    }

    .price-value {
      font-size: 18px;
      font-weight: 700;
      color: #1890ff;
    }
  }

  /* Status Column */
  .status-column {
    text-align: center;
    min-width: 120px;
  }

  /* Actions Column */
  .actions-column {
    display: flex;
    gap: 8px;
    min-width: 100px;
    justify-content: flex-end;

    .ant-btn {
      height: 28px;
      font-size: 12px;
    }
  }

  /* Responsive */
  @media (max-width: 1200px) {
    flex-wrap: wrap;

    .middle-info {
      gap: 12px;
      min-width: 100%;
      order: 3;
    }

    .track-info {
      flex-basis: 60%;
    }

    .price-column {
      flex-basis: 40%;
      text-align: center;
    }

    .status-column,
    .actions-column {
      order: 4;
      flex-basis: 100%;
      margin-top: 8px;
      justify-content: flex-start;
      text-align: left;
    }
  }

  @media (max-width: 768px) {
    padding: 12px;
    gap: 12px;
    flex-direction: column;
    align-items: flex-start;

    .track-info {
      flex-basis: 100%;
      width: 100%;
    }

    .middle-info {
      flex-basis: 100%;
      width: 100%;
      order: unset;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .price-column {
      flex-basis: 100%;
      width: 100%;
      order: unset;
      text-align: center;
    }

    .status-column {
      flex-basis: 100%;
      width: 100%;
      order: unset;
      text-align: left;
    }

    .actions-column {
      flex-basis: 100%;
      width: 100%;
      order: unset;
      justify-content: flex-start;
    }
  }

  @media (max-width: 576px) {
    padding: 10px 12px;
    gap: 8px;

    .package-icon {
      font-size: 20px;
    }

    .track-info {
      width: 100%;
    }

    .middle-info {
      width: 100%;
      grid-template-columns: 1fr;
    }

    .price-column {
      width: 100%;
    }

    .status-column {
      width: 100%;
    }

    .actions-column {
      width: 100%;
    }

    .track-info .track-code {
      font-size: 12px;
    }

    .middle-info {
      grid-template-columns: 1fr;
      gap: 8px;
    }

    .actions-column .ant-btn {
      height: 26px;
      font-size: 11px;
    }
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
      style={{
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid #f0f0f0",
      }}
      styles={{
        header: {
          background: "linear-gradient(135deg, #f5f7fa 0%, #f9fbfc 100%)",
          borderBottom: "1px solid #e8e8e8",
        },
        body: {
          padding: screens.xs ? "12px" : screens.sm ? "16px" : "24px",
          background: "#fafafa",
        },
      }}
    >
      {filtered.length === 0 ? (
        <Empty description={t("parcels.title")} style={{ marginTop: 40 }} />
      ) : (
        <ListContainer>
          {filtered.map((p: any) => {
            const canDelete = p.status === "AWAITING_AT_WAREHOUSE";
            const s = statusIcons[p.status];

            return (
              <StyledListItem key={p.id}>
                {/* Package Icon */}
                <div className="package-icon">📦</div>

                {/* Track Code and Description */}
                <div className="track-info">
                  <span className="track-code"># {p.trackCode}</span>
                  <div className="parcel-description">{p.description}</div>
                </div>

                {/* Middle Info */}
                <div className="middle-info">
                  {p.recipient && (
                    <div className="info-item">
                      <span className="label">{t("parcels.recipient")}</span>
                      <span className="value">{`${p.recipient.lastName} ${p.recipient.firstName}`}</span>
                    </div>
                  )}
                  {p.flight && (
                    <div className="info-item">
                      <span className="label">{t("parcels.flight")}</span>
                      <span className="value">{p.flight.code ?? t("parcels.noFlight")}</span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="price-column">
                  <div className="price-label">{t("parcels.price")}</div>
                  <div className="price-value">${p.price}</div>
                </div>

                {/* Status */}
                <div className="status-column">
                  <Tag color={s?.color || "default"} icon={s?.icon}>
                    {t(`parcels.statuses.${p.status}`, { defaultValue: p.status })}
                  </Tag>
                </div>

                {/* Actions */}
                {canDelete && (
                  <div className="actions-column">
                    <Popconfirm
                      title={t("parcels.confirmDelete")}
                      okText={t("parcels.yes")}
                      cancelText={t("parcels.no")}
                      onConfirm={() => onDelete(p.id)}
                    >
                      <Button danger type="primary" size="small">
                        {t("parcels.delete")}
                      </Button>
                    </Popconfirm>
                  </div>
                )}
              </StyledListItem>
            );
          })}
        </ListContainer>
      )}

      <AddParcelModal open={openAdd} onClose={() => setOpenAdd(false)} onCreated={load} />
    </Card>
  );
}
