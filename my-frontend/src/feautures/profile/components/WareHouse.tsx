import { useEffect, useState } from "react";
import api from "../../../api";
import { Card, Row, Col, Grid, Empty, Skeleton } from "antd";
import { WarehouseCard } from "./WarehouseCard";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";

const { useBreakpoint } = Grid;

const Container = styled.div`
  .warehouse-card-title {
    font-size: 18px;
    font-weight: 700;
    color: #1890ff;
    margin: 0 0 16px 0;
    letter-spacing: -0.5px;
  }

  @media (max-width: 576px) {
    .warehouse-card-title {
      font-size: 16px;
    }
  }
`;

export function Warehouses() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const screens = useBreakpoint();

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/warehouses")
      .then(r => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container>
      <Card
        title={t("warehousesTitle")}
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
        {loading ? (
          <Row gutter={[16, 16]}>
            {[1, 2, 3].map(i => (
              <Col key={i} xs={24} sm={24} md={12} lg={12} xl={8}>
                <Skeleton active paragraph={{ rows: 4 }} />
              </Col>
            ))}
          </Row>
        ) : data.length === 0 ? (
          <Empty description={t("warehousesTitle")} style={{ marginTop: 40 }} />
        ) : (
          <Row gutter={[16, 16]}>
            {data.map((w: any) => (
              <Col key={w.id} xs={24} sm={24} md={12} lg={12} xl={8}>
                <WarehouseCard warehouse={w} />
              </Col>
            ))}
          </Row>
        )}
      </Card>
    </Container>
  );
}
