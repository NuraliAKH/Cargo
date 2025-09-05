import { Card, Row, Col, Typography } from "antd";
import { CarOutlined, RocketOutlined, BranchesOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ServicesSection() {
  const services = [
    {
      name: "Авиа",
      description: "Быстрая доставка воздушным транспортом.",
      icon: <RocketOutlined style={{ fontSize: 28, color: "#1890ff" }} />,
    },
    {
      name: "Авто",
      description: "Надежные перевозки по суше.",
      icon: <CarOutlined style={{ fontSize: 28, color: "#52c41a" }} />,
    },
    {
      name: "Поезд",
      description: "Оптимальный вариант для крупногабаритных грузов.",
      icon: <BranchesOutlined style={{ fontSize: 28, color: "#fa8c16" }} />,
    },
  ];

  return (
    <section id="services" className="max-w-6xl mx-auto py-12">
      <Title level={2}>Услуги</Title>
      <Row gutter={[16, 16]}>
        {services.map((service, index) => (
          <Col key={index} xs={24} sm={12} md={8} style={{ display: "flex" }}>
            <Card style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {service.icon}
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
