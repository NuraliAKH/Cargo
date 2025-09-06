import { Card, Descriptions, message } from "antd";
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

  return (
    <Card
      title={warehouse.name || t("warehouseDefault")}
      extra={<span>{warehouse.city || ""}</span>}
      className="shadow-md rounded-lg"
    >
      <Descriptions column={1} size="small" bordered={false}>
        {warehouse.firstName && (
          <Descriptions.Item label={t("labels.firstName")}>{warehouse.firstName}</Descriptions.Item>
        )}
        {warehouse.lastName && <Descriptions.Item label={t("labels.lastName")}>{warehouse.lastName}</Descriptions.Item>}
        {warehouse.addresLine1 && (
          <Descriptions.Item
            label={
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {t("labels.addressLine1")}
                <CopyOutlined
                  onClick={() => copyToClipboard(warehouse.addresLine1!)}
                  style={{ cursor: "pointer", color: "#1890ff" }}
                />
              </div>
            }
          >
            {warehouse.addresLine1}
          </Descriptions.Item>
        )}
        {warehouse.addresLine2 && (
          <Descriptions.Item label={t("labels.addressLine2")}>{warehouse.addresLine2}</Descriptions.Item>
        )}
        {warehouse.city && <Descriptions.Item label={t("labels.city")}>{warehouse.city}</Descriptions.Item>}
        {warehouse.state && <Descriptions.Item label={t("labels.state")}>{warehouse.state}</Descriptions.Item>}
        {warehouse.zipcode && <Descriptions.Item label={t("labels.zipcode")}>{warehouse.zipcode}</Descriptions.Item>}
        {warehouse.telephone && (
          <Descriptions.Item
            label={
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {t("labels.telephone")}
                <CopyOutlined
                  onClick={() => copyToClipboard(warehouse.telephone!)}
                  style={{ cursor: "pointer", color: "#1890ff" }}
                />
              </div>
            }
          >
            {warehouse.telephone}
          </Descriptions.Item>
        )}
        {warehouse.cell && (
          <Descriptions.Item
            label={
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {t("labels.cell")}
                <CopyOutlined
                  onClick={() => copyToClipboard(warehouse.cell!)}
                  style={{ cursor: "pointer", color: "#1890ff" }}
                />
              </div>
            }
          >
            {warehouse.cell}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
}
