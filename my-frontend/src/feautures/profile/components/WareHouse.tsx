import { useEffect, useState } from "react";
import api from "../../../api";
import { Card, Row, Col, Grid } from "antd";
import { WarehouseCard } from "./WarehouseCard";
import { useTranslation } from "react-i18next";

const { useBreakpoint } = Grid;

export function Warehouses() {
  const [data, setData] = useState<any[]>([]);
  const { t } = useTranslation();
  const screens = useBreakpoint();

  useEffect(() => {
    api.get("/api/warehouses").then(r => setData(r.data));
  }, []);

  return (
    <Card
      title={t("warehousesTitle")}
      style={{
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
      styles={{
        body: {
          padding: screens.xs ? "12px" : "24px",
        },
      }}
    >
      <Row gutter={[16, 16]}>
        {data.map((w: any) => (
          <Col key={w.id} xs={24} sm={24} md={12} lg={12} xl={8}>
            <WarehouseCard warehouse={w} />
          </Col>
        ))}
      </Row>
    </Card>
  );
}
