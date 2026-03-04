import { Card, Descriptions, message, Tooltip, Button, Space, Grid } from "antd";
import { CopyOutlined, GlobalOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { useBreakpoint } = Grid;

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
    <Card
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: screens.xs ? 14 : 16, fontWeight: 600 }}>
            {warehouse.name || t("warehouseDefault")}
          </span>
          <Tooltip title={t("copyAll")}>
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(fullText)}
              style={{ color: "#1890ff" }}
              size={screens.xs ? "small" : "middle"}
            />
          </Tooltip>
        </div>
      }
      style={{
        borderRadius: 12,
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        height: "100%",
        transition: "all 0.3s ease",
      }}
      hoverable
      styles={{ body: { padding: screens.xs ? "12px" : "16px" } }}
    >
      <Descriptions column={1} size="small" bordered={false} labelStyle={{ fontWeight: 500, color: "#666" }}>
        {warehouse.firstName && (
          <Descriptions.Item label={t("labels.firstName")}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <span>{warehouse.firstName}</span>
              <CopyOutlined
                onClick={() => copyToClipboard(warehouse.firstName!)}
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
                style={{ cursor: "pointer", color: "#1890ff", fontSize: 14 }}
              />
            </Space>
          </Descriptions.Item>
        )}
        {warehouse.addresLine1 && (
          <Descriptions.Item label={t("labels.addressLine1")}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <span style={{ wordBreak: "break-word" }}>{warehouse.addresLine1}</span>
              <CopyOutlined
                onClick={() => copyToClipboard(warehouse.addresLine1!)}
                style={{ cursor: "pointer", color: "#1890ff", fontSize: 14, flexShrink: 0 }}
              />
            </Space>
          </Descriptions.Item>
        )}
        {warehouse.addresLine2 && (
          <Descriptions.Item label={t("labels.addressLine2")}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <span style={{ wordBreak: "break-word" }}>{warehouse.addresLine2}</span>
              <CopyOutlined
                onClick={() => copyToClipboard(warehouse.addresLine2!)}
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
                style={{ cursor: "pointer", color: "#1890ff", fontSize: 14 }}
              />
            </Space>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
}
