import React, { useEffect, useState } from "react";
import { Card, List, Tag, Button, Spin, Typography } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import api from "../../../api";

const { Text } = Typography;

type Flight = {
  id: number;
  code?: string | null;
  status?: string;
  departureAt: string; // ISO
  departureFrom: string;
  arrivalTo: string;
  arrivalAt: string; // ISO
};

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
    <Card
      title={t("flights.title")}
      extra={
        <Button icon={<SyncOutlined />} onClick={load} loading={loading}>
          {t("flights.refresh")}
        </Button>
      }
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: 30 }}>
          <Spin />
        </div>
      ) : (
        <List
          dataSource={flights}
          renderItem={(item, idx) => {
            const bg = idx % 2 === 0 ? CHESS_COLOR_A : CHESS_COLOR_B;
            const dep = formatTZ(item.departureAt, "Asia/Tashkent");
            const arr = formatTZ(item.arrivalAt, "Asia/Tashkent");

            return (
              <List.Item
                key={item.id}
                style={{
                  background: bg,
                  borderRadius: 6,
                  marginBottom: 8,
                  padding: "12px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <Text strong>{item.departureFrom}</Text> → <Text strong>{item.arrivalTo}</Text>
                  <Text style={{ marginLeft: 12, color: "#666" }}>
                    ({dep} — {arr})
                  </Text>
                </div>
                <Tag color="blue">{item.status || t("flights.noStatus")}</Tag>
              </List.Item>
            );
          }}
        />
      )}
    </Card>
  );
}
