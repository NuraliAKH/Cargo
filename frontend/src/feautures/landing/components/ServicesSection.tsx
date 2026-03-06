import { Card, Row, Col, Typography } from "antd";
import { CarOutlined, RocketOutlined, BranchesOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const { Title, Text } = Typography;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StyledTitle = styled(Title)`
  && {
    color: #0050b3;
    font-weight: 700;
    animation: ${fadeInUp} 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const StyledCard = styled(Card)<{ delay: number }>`
  && {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 18px;
    border: 2px solid transparent;
    background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    animation: ${fadeInUp} 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: ${props => props.delay}ms;
    opacity: 0;
    cursor: pointer;
    overflow: hidden;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(24, 144, 255, 0.15), transparent);
      transition: left 0.6s ease;
    }

    &::after {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(24, 144, 255, 0.1) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.5s ease;
    }

    &:hover {
      transform: translateY(-12px) scale(1.04) rotate(1deg);
      box-shadow: 0 20px 50px rgba(24, 144, 255, 0.3), 0 0 40px rgba(24, 144, 255, 0.1), inset 0 0 30px rgba(24, 144, 255, 0.05);
      border-color: #1890ff;
      background: linear-gradient(135deg, #ffffff 0%, #e6f7ff 100%);

      &::before {
        left: 100%;
      }

      &::after {
        opacity: 1;
      }

      .icon {
        animation: ${rotate} 0.8s ease-in-out;
        color: #0050b3;
        filter: drop-shadow(0 4px 12px rgba(24, 144, 255, 0.4));
        transform: scale(1.15);
      }
    }

    .icon {
      transition: all 0.4s ease;
    }
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const ServiceTitle = styled(Title)`
  && {
    margin: 0;
    color: #0050b3;
  }
`;

const ServiceText = styled(Text)`
  display: block;
  margin-top: 8px;
  line-height: 1.6;
  color: #595959;
`;

export default function ServicesSection() {
  const { t } = useTranslation();
  const services = t("services.items", { returnObjects: true }) as Array<{
    name: string;
    description: string;
  }>;

  const icons = [
    <RocketOutlined className="icon" style={{ fontSize: 28, color: "#1890ff" }} />,
    <CarOutlined className="icon" style={{ fontSize: 28, color: "#1890ff" }} />,
    <BranchesOutlined className="icon" style={{ fontSize: 28, color: "#1890ff" }} />,
  ];

  return (
    <section id="services" className="max-w-6xl mx-auto py-12">
      <StyledTitle level={2}>{t("services.title")}</StyledTitle>
      <Row gutter={[16, 16]}>
        {services.map((service, index) => (
          <Col key={index} xs={24} sm={12} md={8} style={{ display: "flex" }}>
            <StyledCard delay={index * 150}>
              <IconWrapper>
                {icons[index]}
                <ServiceTitle level={4}>
                  {service.name}
                </ServiceTitle>
              </IconWrapper>
              <ServiceText>{service.description}</ServiceText>
            </StyledCard>
          </Col>
        ))}
      </Row>
    </section>
  );
}
