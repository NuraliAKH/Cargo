import { Card, Descriptions, message, Tooltip } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{warehouse.name || t("warehouseDefault")}</span>
          <Tooltip title={t("copyAll")}>
            <CopyOutlined
              onClick={() => copyToClipboard(fullText)}
              style={{ cursor: "pointer", fontSize: 20, color: "#1890ff" }}
            />
          </Tooltip>
        </div>
      }
      extra={<span>{warehouse.city || ""}</span>}
      className="shadow-md rounded-lg"
    >
      <Descriptions column={1} size="small" bordered={false}>
        {warehouse.firstName && (
          <Descriptions.Item label={t("labels.firstName")}>
            {warehouse.firstName}
            <CopyOutlined
              onClick={() => copyToClipboard(warehouse.firstName!)}
              style={{ cursor: "pointer", marginLeft: 8, color: "#1890ff" }}
            />
          </Descriptions.Item>
        )}
        {warehouse.lastName && (
          <Descriptions.Item label={t("labels.lastName")}>
            {warehouse.lastName}
            <CopyOutlined
              onClick={() => copyToClipboard(warehouse.lastName!)}
              style={{ cursor: "pointer", marginLeft: 8, color: "#1890ff" }}
            />
          </Descriptions.Item>
        )}
        {warehouse.addresLine1 && (
          <Descriptions.Item label={t("labels.addressLine1")}>
            {warehouse.addresLine1}
            <CopyOutlined
              onClick={() => copyToClipboard(warehouse.addresLine1!)}
              style={{ cursor: "pointer", marginLeft: 8, color: "#1890ff" }}
            />
          </Descriptions.Item>
        )}
        {warehouse.addresLine2 && (
          <Descriptions.Item label={t("labels.addressLine2")}>
            {warehouse.addresLine2}
            <CopyOutlined
              onClick={() => copyToClipboard(warehouse.addresLine2!)}
              style={{ cursor: "pointer", marginLeft: 8, color: "#1890ff" }}
            />
          </Descriptions.Item>
        )}
        {warehouse.city && (
          <Descriptions.Item label={t("labels.city")}>
            {warehouse.city}
            <CopyOutlined
              onClick={() => copyToClipboard(warehouse.city!)}
              style={{ cursor: "pointer", marginLeft: 8, color: "#1890ff" }}
            />
          </Descriptions.Item>
        )}
        {warehouse.state && (
          <Descriptions.Item label={t("labels.state")}>
            {warehouse.state}
            <CopyOutlined
              onClick={() => copyToClipboard(warehouse.state!)}
              style={{ cursor: "pointer", marginLeft: 8, color: "#1890ff" }}
            />
          </Descriptions.Item>
        )}
        {warehouse.zipcode && (
          <Descriptions.Item label={t("labels.zipcode")}>
            {warehouse.zipcode}
            <CopyOutlined
              onClick={() => copyToClipboard(String(warehouse.zipcode))}
              style={{ cursor: "pointer", marginLeft: 8, color: "#1890ff" }}
            />
          </Descriptions.Item>
        )}
        {warehouse.telephone && (
          <Descriptions.Item label={t("labels.telephone")}>
            {warehouse.telephone}
            <CopyOutlined
              onClick={() => copyToClipboard(warehouse.telephone!)}
              style={{ cursor: "pointer", marginLeft: 8, color: "#1890ff" }}
            />
          </Descriptions.Item>
        )}
        {warehouse.cell && (
          <Descriptions.Item label={t("labels.cell")}>
            {warehouse.cell}
            <CopyOutlined
              onClick={() => copyToClipboard(warehouse.cell!)}
              style={{ cursor: "pointer", marginLeft: 8, color: "#1890ff" }}
            />
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
}
