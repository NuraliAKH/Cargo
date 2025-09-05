import { Card, Descriptions, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";

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
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success("Скопировано!");
    });
  };

  return (
    <Card
      title={warehouse.name || "Склад"}
      extra={<span>{warehouse.city || ""}</span>}
      className=" shadow-md rounded-lg "
    >
      <Descriptions column={1} size="small" bordered={false}>
        {warehouse.firstName && <Descriptions.Item label="Firstname">{warehouse.firstName}</Descriptions.Item>}
        {warehouse.lastName && <Descriptions.Item label="Lastname">{warehouse.lastName}</Descriptions.Item>}
        {warehouse.addresLine1 && (
          <Descriptions.Item
            label={
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                Address Line 1
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
        {warehouse.addresLine2 && <Descriptions.Item label="Address Line 2">{warehouse.addresLine2}</Descriptions.Item>}
        {warehouse.city && <Descriptions.Item label="City">{warehouse.city}</Descriptions.Item>}
        {warehouse.state && <Descriptions.Item label="State">{warehouse.state}</Descriptions.Item>}
        {warehouse.zipcode && <Descriptions.Item label="Zipcode">{warehouse.zipcode}</Descriptions.Item>}
        {warehouse.telephone && (
          <Descriptions.Item
            label={
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                Telephone
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
                Cell
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
