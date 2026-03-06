import React, { useEffect, useState } from "react";
import { Card, List, Tag, Button, Spin, Typography, Space } from "antd";
import { SyncOutlined, RocketOutlined, ClockCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import api from "../../../api";

const { Text } = Typography;

type Flight = {
  id: number;
  code?: string | null;
  status?: string;
  departureAt: string;
  departureFrom: string;
  arrivalTo: string;
  arrivalAt: string;
};

const CHESS_COLOR_A = "#f0f5ff";
const CHESS_COLOR_B = "#ffeeefff";

const fadeInSlide = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const planeMove = keyframes`
  0% {
    transform: translateX(0) translateY(0);
  }
  50% {
    transform: translateX(10px) translateY(-3px);
  }
  100% {
    transform: translateX(0) translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(0.95);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 10px rgba(24, 144, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(24, 144, 255, 0.6), 0 0 30px rgba(24, 144, 255, 0.3);
  }
`;

const SectionContainer = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 16px;

  @media (min-width: 768px) {
    padding: 0 24px;
  }

  @media (min-width: 1024px) {
    padding: 0 32px;
    max-width: 1400px;
    margin: 0 auto;
  }

  @media (min-width: 1440px) {
    padding: 0 40px;
    max-width: 1600px;
  }

  @media (min-width: 1920px) {
    padding: 0 60px;
    max-width: 1800px;
  }
`;

const StyledCard = styled(Card)`
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: none;
  background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 12px;

  .ant-list {
    border: none;
  }

  .ant-list-item {
    padding: 0 !important;
    border: none !important;
  }

  &:hover {
    box-shadow: 0 12px 40px rgba(24, 144, 255, 0.2);
    transform: translateY(-2px);
  }

  @media (min-width: 1024px) {
    padding: 18px;
    border-radius: 24px;
  }

  @media (min-width: 1440px) {
    padding: 24px;
    border-radius: 28px;
  }
`;

const StyledListItem = styled(List.Item)<{ bg: string; delay: number }>`
  background: ${props => props.bg};
  border-radius: 14px;
  margin-bottom: 12px;
  padding: 14px 18px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${fadeInSlide} 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: ${props => props.delay}ms;
  opacity: 0;
  cursor: pointer;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  min-height: 62px;

  @media (min-width: 1024px) {
    min-height: 70px;
    padding: 16px 22px !important;
    margin-bottom: 14px;
  }

  @media (min-width: 1440px) {
    min-height: 76px;
    padding: 18px 28px !important;
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 6px;
    background: linear-gradient(180deg, #1890ff 0%, #722ed1 100%);
    transform: scaleY(0);
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &::after {
    content: "";
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
    transform: translateX(8px) scale(1.02);
    box-shadow:
      0 12px 32px rgba(24, 144, 255, 0.3),
      inset 0 0 30px rgba(24, 144, 255, 0.08);
    border-color: #1890ff;
    background: linear-gradient(135deg, ${props => props.bg} 0%, rgba(255, 255, 255, 0.95) 100%);
  }

  &:hover::before {
    transform: scaleY(1);
  }

  &:hover::after {
    opacity: 1;
  }

  &:hover .plane-icon {
    animation: ${planeMove} 2s ease-in-out infinite;
    color: #1890ff;
    filter: drop-shadow(0 4px 8px rgba(24, 144, 255, 0.4));
  }

  &:hover .route-line {
    width: 100%;
    background: linear-gradient(90deg, #1890ff 0%, #722ed1 100%);
  }

  &:hover .status-tag {
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

const FlightContent = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  position: relative;
  z-index: 1;
  padding-left: 8px;

  @media (min-width: 768px) {
    gap: 16px;
    padding-left: 12px;
  }

  @media (min-width: 1024px) {
    gap: 20px;
    padding-left: 16px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding-left: 0;
  }
`;

const FlightHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
  }
`;

const FlightCode = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
  color: white;
  border-radius: 16px;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  animation: ${glow} 3s ease-in-out infinite;
  flex-shrink: 0;
  white-space: nowrap;
  transition: all 0.3s ease;

  .plane-icon {
    transition: all 0.3s ease;
  }

  @media (min-width: 1024px) {
    font-size: 13px;
    padding: 6px 14px;
  }

  @media (min-width: 1440px) {
    font-size: 14px;
    padding: 7px 16px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 5px 12px;
  }
`;

const RouteContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  white-space: nowrap;
  flex: 0 1 auto;

  @media (min-width: 768px) {
    gap: 10px;
  }

  @media (min-width: 1024px) {
    gap: 12px;
    flex: 0 1 50%;
  }

  @media (max-width: 768px) {
    gap: 6px;
    width: 100%;
    white-space: normal;
  }
`;

const CityBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 85px;
  flex-shrink: 0;

  @media (min-width: 1024px) {
    min-width: 95px;
    gap: 3px;
  }

  @media (min-width: 1440px) {
    min-width: 110px;
  }

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const CityName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #0050b3;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.3s ease;
  line-height: 1.2;

  @media (min-width: 1024px) {
    font-size: 15px;
  }

  @media (min-width: 1440px) {
    font-size: 16px;
  }

  .location-icon {
    font-size: 13px;
    color: #1890ff;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: 16px;

    .location-icon {
      font-size: 14px;
    }
  }
`;

const TimeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: #999;
  font-weight: 500;
  line-height: 1;

  @media (min-width: 1024px) {
    font-size: 12px;
  }

  @media (min-width: 1440px) {
    font-size: 12.5px;
  }

  .clock-icon {
    color: #1890ff;
    font-size: 11px;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: 12px;

    .clock-icon {
      font-size: 12px;
    }
  }
`;

const RouteLine = styled.div`
  height: 2px;
  width: 18px;
  background: linear-gradient(90deg, #d9d9d9 0%, #bfbfbf 100%);
  border-radius: 1px;
  flex-shrink: 0;
  transition: all 0.3s ease;

  @media (min-width: 1024px) {
    width: 22px;
    height: 2.5px;
  }

  @media (min-width: 1440px) {
    width: 28px;
  }

  &::after {
    content: "→";
    position: relative;
    left: 5px;
    top: -8px;
    color: #1890ff;
    font-weight: bold;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const StatusTag = styled(Tag)<{ statusColor: string }>`
  && {
    position: relative;
    padding: 3px 10px;
    font-size: 10px;
    font-weight: 600;
    border-radius: 12px;
    border: 1px solid ${props => props.statusColor};
    background: ${props => props.statusColor}15;
    color: ${props => props.statusColor};
    box-shadow: 0 2px 6px ${props => props.statusColor}25;
    transition: all 0.3s ease;
    white-space: nowrap;
    flex-shrink: 0;

    @media (min-width: 1024px) {
      padding: 5px 14px;
      font-size: 12px;
      box-shadow: 0 3px 8px ${props => props.statusColor}30;
    }

    @media (min-width: 1440px) {
      padding: 6px 16px;
      font-size: 13px;
    }

    @media (max-width: 768px) {
      position: static;
      font-size: 11px;
      padding: 6px 12px;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #8c8c8c;

  .empty-icon {
    font-size: 64px;
    color: #d9d9d9;
    margin-bottom: 16px;
    animation: ${pulse} 2s ease-in-out infinite;
  }

  .empty-text {
    font-size: 16px;
    color: #595959;
    margin-top: 12px;
  }

  @media (min-width: 1024px) {
    padding: 80px 40px;

    .empty-icon {
      font-size: 80px;
      margin-bottom: 24px;
    }

    .empty-text {
      font-size: 18px;
      margin-top: 16px;
    }
  }

  @media (min-width: 1440px) {
    padding: 100px 60px;

    .empty-icon {
      font-size: 96px;
    }

    .empty-text {
      font-size: 20px;
    }
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #e6f7ff 0%, #f0f5ff 100%);
  border-radius: 16px;
  border-left: 5px solid #1890ff;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.15);
  position: relative;
  overflow: hidden;
  gap: 16px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transform: translateX(-100%);
    animation: shine 3s infinite;
  }

  @keyframes shine {
    to {
      transform: translateX(100%);
    }
  }

  @media (min-width: 1024px) {
    padding: 28px 32px;
    margin-bottom: 28px;
    gap: 24px;
  }

  @media (min-width: 1440px) {
    padding: 32px 40px;
    margin-bottom: 32px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
    padding: 20px;
  }
`;

const StyledTitle = styled(Typography.Title)`
  && {
    margin: 0;
    color: #0050b3;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 28px;

    .title-icon {
      color: #1890ff;
      font-size: 32px;
      animation: ${planeMove} 3s ease-in-out infinite;
    }

    @media (min-width: 1024px) {
      font-size: 32px;

      .title-icon {
        font-size: 36px;
      }
    }

    @media (min-width: 1440px) {
      font-size: 36px;

      .title-icon {
        font-size: 40px;
      }
    }

    @media (max-width: 768px) {
      font-size: 22px;

      .title-icon {
        font-size: 26px;
      }
    }
  }
`;

const RefreshButton = styled(Button)`
  && {
    border-radius: 10px;
    padding: 8px 20px;
    height: 44px;
    font-weight: 600;
    border: 2px solid #1890ff;
    background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
    color: #1890ff;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
    font-size: 14px;
    flex-shrink: 0;

    @media (min-width: 1024px) {
      padding: 10px 28px;
      height: 48px;
      font-size: 15px;
      border-radius: 12px;
      box-shadow: 0 6px 16px rgba(24, 144, 255, 0.2);
    }

    @media (min-width: 1440px) {
      padding: 12px 32px;
      height: 52px;
      font-size: 16px;
    }

    &:hover {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 8px 20px rgba(24, 144, 255, 0.3);
      background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
      color: white;
      border-color: #0050b3;
    }

    &:active {
      transform: translateY(-1px);
    }

    .anticon-sync {
      transition: transform 0.3s ease;
    }

    &:hover .anticon-sync {
      transform: rotate(180deg);
    }

    @media (max-width: 768px) {
      width: 100%;
      height: 40px;
      padding: 6px 16px;
    }
  }
`;

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
    <SectionContainer>
      <TitleWrapper>
        <StyledTitle level={2}>
          <RocketOutlined className="title-icon" />
          {t("flights")}
        </StyledTitle>
        <RefreshButton icon={<SyncOutlined />} onClick={load} loading={loading}>
          {t("refresh")}
        </RefreshButton>
      </TitleWrapper>

      <StyledCard>
        {loading ? (
          <div style={{ textAlign: "center", padding: 30 }}>
            <Spin tip={t("loading")} />
          </div>
        ) : flights.length === 0 ? (
          <EmptyState>
            <RocketOutlined className="empty-icon" />
            <div className="empty-text">{t("noFlights") || "No flights available"}</div>
          </EmptyState>
        ) : (
          <List
            dataSource={flights}
            renderItem={(item, idx) => {
              const bg = idx % 2 === 0 ? CHESS_COLOR_A : CHESS_COLOR_B;
              const depTime = formatTZ(item.departureAt, "Asia/Tashkent");
              const arrTime = formatTZ(item.arrivalAt, "Asia/Tashkent");

              const statusColors: Record<string, string> = {
                SCHEDULED: "#1890ff",
                DEPARTED: "#52c41a",
                ARRIVED: "#722ed1",
                CANCELLED: "#ff4d4f",
              };
              const statusColor = statusColors[item.status || "SCHEDULED"] || "#1890ff";

              return (
                <StyledListItem key={item.id} bg={bg} delay={idx * 60}>
                  <FlightContent>
                    <FlightCode>
                      <RocketOutlined className="plane-icon" />
                      {item.code || `FL-${item.id}`}
                    </FlightCode>

                    <RouteContainer>
                      <CityBlock>
                        <CityName>
                          <EnvironmentOutlined className="location-icon" />
                          {item.departureFrom}
                        </CityName>
                        <TimeInfo>
                          <ClockCircleOutlined className="clock-icon" />
                          {depTime}
                        </TimeInfo>
                      </CityBlock>

                      <RouteLine className="route-line" />

                      <CityBlock>
                        <CityName>
                          <EnvironmentOutlined className="location-icon" />
                          {item.arrivalTo}
                        </CityName>
                        <TimeInfo>
                          <ClockCircleOutlined className="clock-icon" />
                          {arrTime}
                        </TimeInfo>
                      </CityBlock>
                    </RouteContainer>
                  </FlightContent>

                  <StatusTag className="status-tag" statusColor={statusColor}>
                    {t(`flights2.status.${item.status || "SCHEDULED"}`)}
                  </StatusTag>
                </StyledListItem>
              );
            }}
          />
        )}
      </StyledCard>
    </SectionContainer>
  );
}
