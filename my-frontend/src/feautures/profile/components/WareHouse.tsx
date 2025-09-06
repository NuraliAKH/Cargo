import { useEffect, useState } from "react";
import api from "../../../api";
import { Card, Row, Col } from "antd";
import { WarehouseCard } from "./WarehouseCard";
import { useTranslation } from "react-i18next";

export function Warehouses() {
  const [data, setData] = useState<any[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    api.get("/api/warehouses").then(r => setData(r.data));
  }, []);

  return (
    <Card title={t("warehousesTitle")} className="h-full">
      <Row gutter={[16, 16]}>
        {data.map((w: any) => (
          <Col key={w.id} xs={24} sm={24} md={12} lg={12} xl={12}>
            <WarehouseCard warehouse={w} />
          </Col>
        ))}
      </Row>
    </Card>
  );
}
