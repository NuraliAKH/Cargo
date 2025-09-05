import { useEffect, useState } from "react";
import api from "../../../api";
import { Card, Row, Col } from "antd";
import { WarehouseCard } from "./WarehouseCard";

export function Warehouses() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    api.get("/api/warehouses").then(r => setData(r.data));
  }, []);

  return (
    <Card title="Адреса складов" className="h-full">
      <Row gutter={[16, 16]}>
        {data.map((w: any) => (
          <Col
            key={w.id}
            xs={24} // мобильные — 1 в ряд
            sm={24}
            md={12} // планшеты — 2 в ряд
            lg={12} // десктопы — 2 в ряд
            xl={12} // большие экраны — 2 в ряд
          >
            <WarehouseCard warehouse={w} />
          </Col>
        ))}
      </Row>
    </Card>
  );
}
