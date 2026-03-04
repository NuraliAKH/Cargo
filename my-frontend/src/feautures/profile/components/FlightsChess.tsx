import React, { useEffect, useState } from "react";
import { Card, List, Tag, Button, Spin, Typography } from "antd";
import { SyncOutlined, DeploymentUnitOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import api from "../../../api";
import styled from "@emotion/styled";

const { Text } = Typography;

const StyledContainer = styled.div`
  .ant-card {
    border-radius: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;

    &:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
  }

  .ant-card-head {
    background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
    border-bottom: 2px solid #1890ff;
    padding: 20px 24px;
  }

  .ant-card-head-title {
    color: #0050b3;
    font-weight: 700;
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 8px;

    .icon {
      color: #1890ff;
      font-size: 22px;
    }
  }

  .ant-btn-primary {
    background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    height: 36px;
    padding: 0 16px;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }
`;

type Flight = {
  id: number;
  code?: string | null;
  status?: string;
  departureAt: string; // ISO
  departureFrom: string;
  arrivalTo: string;
  arrivalAt: string; // ISO
};

const StyledListItem = styled(List.Item)`
  background: linear-gradient(90deg, #f6f9ff 0%, #ffffff 100%);
  border-radius: 10px;
  margin-bottom: 12px;
  padding: 16px 20px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e6f2ff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.08);

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(90deg, #e6f7ff 0%, #f0f5ff 100%);
    border-color: #1890ff;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
  }
`;

const FlightRoute = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;

  .route-cities {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: #262626;
    font-size: 14px;

    .arrow {
      color: #1890ff;
      font-size: 16px;
      font-weight: 700;
    }
  }

  .route-times {
    color: #8c9aad;
    font-size: 12px;
    white-space: nowrap;
  }
`;

const StyledTag = styled(Tag)`
  border-radius: 6px;
  padding: 4px 12px;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: none;

  &.ant-tag-blue {
    background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
    color: #0050b3;
  }
`;

const EmptyContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #8c9aad;

  .empty-text {
    font-size: 14px;
  }
`;

const CHESS_COLOR_A = "#f0f5ff";
const CHESS_COLOR_B = "#fff7e6";

function formatTZ(dateIso: string, timeZone: string) {
  try {
    const d = new Date(dateIso);
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
      hour12: false,
    }).format(d);
  } catch {
    return "-";
  }
}

export default function FlightsList() {
  const { t } = useTranslation();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/flights");
      setFlights(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <StyledContainer>
      <Card
        title={
          <span className="ant-card-head-title">
            <DeploymentUnitOutlined className="icon" />
            {t("flights.title")}
          </span>
        }
        extra={
          <Button type="primary" icon={<SyncOutlined />} onClick={load} loading={loading}>
            {t("flights.refresh")}
          </Button>
        }
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: 30 }}>
            <Spin />
          </div>
        ) : flights.length === 0 ? (
          <EmptyContainer>
            <div className="empty-text">{t("flights.noFlights") || "No flights available"}</div>
          </EmptyContainer>
        ) : (
          <List
            dataSource={flights}
            renderItem={(item) => {
              const dep = formatTZ(item.departureAt, "Asia/Tashkent");
              const arr = formatTZ(item.arrivalAt, "Asia/Tashkent");

              return (
                <StyledListItem key={item.id}>
                  <FlightRoute>
                    <div className="route-cities">
                      <span>{item.departureFrom}</span>
                      <span className="arrow">→</span>
                      <span>{item.arrivalTo}</span>
                    </div>
                    <div className="route-times">
                      ({dep} — {arr})
                    </div>
                  </FlightRoute>
                  <StyledTag color="blue">{item.status || t("flights.noStatus")}</StyledTag>
                </StyledListItem>
              );
            }}
          />
        )}
      </Card>
    </StyledContainer>
  );
}
