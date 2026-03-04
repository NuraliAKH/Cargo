import { Card, Descriptions, message, Tooltip, Button, Space, Grid } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";

const { useBreakpoint } = Grid;

const StyledWarehouseCard = styled(Card)`
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  }

  .ant-card-head {
    background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
    border-bottom: 2px solid #1890ff;
    padding: 12px 16px;
  }

  .ant-card-body {
    flex: 1;
    padding: 16px;
  }

  /* Labels Styling */
  .ant-descriptions-item-label {
    color: #8c8c8c !important;
    font-weight: 500 !important;
    font-size: 12px !important;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 10px 0 6px 0 !important;
  }

  /* Values Styling */
  .ant-descriptions-item-content {
    color: #262626 !important;
    font-weight: 600 !important;
    font-size: 14px !important;
    padding: 6px 0 10px 0 !important;
  }

  /* Description Item */
  .ant-descriptions-item {
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }
  }

  .copy-icon {
    transition: all 0.2s ease;
    opacity: 0.5;
    color: #1890ff;

    &:hover {
      opacity: 1;
      transform: scale(1.2);
    }
  }
`;

export interface Warehouse {
  id: number;
  name: string;
  location: string;
  firstName?: string;
  lastName?: string;
  addresLine1?: string;
  addresLine2?: string;
  city?: string;
  state?: string;
  zipcode?: number;
  telephone?: string;
  cell?: string;
}

interface WarehouseCardProps {
  warehouse: Warehouse;
}

export function WarehouseCard({ warehouse }: WarehouseCardProps) {
  const { t } = useTranslation();
  const screens = useBreakpoint();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success(t("copied"));
    });
  };

  // Формируем текст для общей кнопки
  const fullText = [
    warehouse.name,
    warehouse.telephone,
    [warehouse.state, warehouse.city, warehouse.addresLine1, warehouse.addresLine2, warehouse.zipcode]
      .filter(Boolean)
      .join(", "),
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <StyledWarehouseCard
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: screens.xs ? 14 : 16, fontWeight: 700, color: "#1890ff" }}>
            {warehouse.name || t("warehouseDefault")}
          </span>
          <Tooltip title={t("copyAll")}>
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(fullText)}
              style={{ color: "#1890ff", width: 32, height: 32 }}
              size={screens.xs ? "small" : "middle"}
            />
          </Tooltip>
        </div>
      }
      style={{
        borderRadius: 12,
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
      }}
      hoverable
      styles={{ body: { padding: screens.xs ? "12px" : "16px" } }}
    >
      <Descriptions column={1} size="small" bordered={false}>
        {warehouse.firstName && (
          <Descriptions.Item label={t("labels.firstName")}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <span>{warehouse.firstName}</span>
              <CopyOutlined
                onClick={() => copyToClipboard(warehouse.firstName!)}
                className="copy-icon"
                style={{ cursor: "pointer", color: "#1890ff", fontSize: 14 }}
              />
            </Space>
          </Descriptions.Item>
        )}
        {warehouse.lastName && (
          <Descriptions.Item label={t("labels.lastName")}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <span>{warehouse.lastName}</span>
              <CopyOutlined
                onClick={() => copyToClipboard(warehouse.lastName!)}
                className="copy-icon"
                style={{ cursor: "pointer", color: "#1890ff", fontSize: 14 }}
              />
            </Space>
          </Descriptions.Item>
        )}
        {warehouse.addresLine1 && (
          <Descriptions.Item label={t("labels.addressLine1")}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <span style={{ wordBreak: "break-word", flex: 1 }}>{warehouse.addresLine1}</span>
              <CopyOutlined
                onClick={() => copyToClipboard(warehouse.addresLine1!)}
                className="copy-icon"
                style={{ cursor: "pointer", color: "#1890ff", fontSize: 14, flexShrink: 0 }}
              />
            </Space>
          </Descriptions.Item>
        )}
        {warehouse.addresLine2 && (
          <Descriptions.Item label={t("labels.addressLine2")}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <span style={{ wordBreak: "break-word", flex: 1 }}>{warehouse.addresLine2}</span>
              <CopyOutlined
                onClick={() => copyToClipboard(warehouse.addresLine2!)}
                className="copy-icon"
                style={{ cursor: "pointer", color: "#1890ff", fontSize: 14, flexShrink: 0 }}
              />
            </Space>
          </Descriptions.Item>
        )}
        {warehouse.city && (
          <Descriptions.Item label={t("labels.city")}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <span>{warehouse.city}</span>
              <CopyOutlined
                onClick={() => copyToClipboard(warehouse.city!)}
                className="copy-icon"
                style={{ cursor: "pointer", color: "#1890ff", fontSize: 14 }}
              />
            </Space>
          </Descriptions.Item>
        )}
        {warehouse.state && (
          <Descriptions.Item label={t("labels.state")}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <span>{warehouse.state}</span>
              <CopyOutlined
                onClick={() => copyToClipboard(warehouse.state!)}
                className="copy-icon"
                style={{ cursor: "pointer", color: "#1890ff", fontSize: 14 }}
              />
            </Space>
          </Descriptions.Item>
        )}
        {warehouse.zipcode && (
          <Descriptions.Item label={t("labels.zipcode")}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <span>{warehouse.zipcode}</span>
              <CopyOutlined
                onClick={() => copyToClipboard(String(warehouse.zipcode))}
                className="copy-icon"
                style={{ cursor: "pointer", color: "#1890ff", fontSize: 14 }}
              />
            </Space>
          </Descriptions.Item>
        )}
        {warehouse.telephone && (
          <Descriptions.Item label={t("labels.telephone")}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <span>{warehouse.telephone}</span>
              <CopyOutlined
                onClick={() => copyToClipboard(warehouse.telephone!)}
                className="copy-icon"
                style={{ cursor: "pointer", color: "#1890ff", fontSize: 14 }}
              />
            </Space>
          </Descriptions.Item>
        )}
        {warehouse.cell && (
          <Descriptions.Item label={t("labels.cell")}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <span>{warehouse.cell}</span>
              <CopyOutlined
                onClick={() => copyToClipboard(warehouse.cell!)}
                className="copy-icon"
                style={{ cursor: "pointer", color: "#1890ff", fontSize: 14 }}
              />
            </Space>
          </Descriptions.Item>
        )}
      </Descriptions>
    </StyledWarehouseCard>
  );
}
