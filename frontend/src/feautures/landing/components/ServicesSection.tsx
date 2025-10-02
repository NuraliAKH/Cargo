import { Card, Row, Col, Typography } from "antd";
import { CarOutlined, RocketOutlined, BranchesOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

export default function ServicesSection() {
  const { t } = useTranslation();
  const services = t("services.items", { returnObjects: true }) as Array<{
    name: string;
    description: string;
  }>;

  const icons = [
    <RocketOutlined style={{ fontSize: 28, color: "#1890ff" }} />,
    <CarOutlined style={{ fontSize: 28, color: "#1890ff" }} />,
    <BranchesOutlined style={{ fontSize: 28, color: "#1890ff" }} />,
  ];

  return (
    <section id="services" className="max-w-6xl mx-auto py-12">
      <Title level={2}>{t("services.title")}</Title>
      <Row gutter={[16, 16]}>
        {services.map((service, index) => (
          <Col key={index} xs={24} sm={12} md={8} style={{ display: "flex" }}>
            <Card style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {icons[index]}
                <Title level={4} style={{ margin: 0 }}>
                  {service.name}
                </Title>
              </div>
              <Text style={{ display: "block", marginTop: 8 }}>{service.description}</Text>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
}
