import { useEffect, useState } from "react";
import api from "../../../api";
import { Button, Card, List, message, Popconfirm, Segmented, Tag } from "antd";
import AddParcelModal from "./AddParcelModal";

const STATUS_LABELS: Record<string, string> = {
  AWAITING_AT_WAREHOUSE: "Ожидается на складе",
  AT_WAREHOUSE: "На складе",
  IN_TRANSIT: "В пути",
  AT_LOCAL_WAREHOUSE: "В местном складе",
  WITH_COURIER: "У курьера",
  DELIVERED: "Доставлено",
};

export function Parcels() {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [openAdd, setOpenAdd] = useState(false);

  const load = () => api.get("/api/parcels/my").then(r => setItems(r.data));
  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id: string) => {
    try {
      await api.delete(`/api/parcels/${id}`);
      message.success("Посылка удалена");
      load();
    } catch {
      message.error("Не удалось удалить посылку");
    }
  };

  const filtered = filter ? items.filter(p => p.status === filter) : items;

  return (
    <Card
      title="Мои посылки"
      extra={
        <div className="flex items-center gap-2">
          <Segmented
            options={[
              { label: "Все", value: "ALL" },
              { label: STATUS_LABELS.AWAITING_AT_WAREHOUSE, value: "AWAITING_AT_WAREHOUSE" },
              { label: STATUS_LABELS.AT_WAREHOUSE, value: "AT_WAREHOUSE" },
              { label: STATUS_LABELS.IN_TRANSIT, value: "IN_TRANSIT" },
              { label: STATUS_LABELS.AT_LOCAL_WAREHOUSE, value: "AT_LOCAL_WAREHOUSE" },
              { label: STATUS_LABELS.WITH_COURIER, value: "WITH_COURIER" },
              { label: STATUS_LABELS.DELIVERED, value: "DELIVERED" },
            ]}
            onChange={(v: any) => setFilter(v === "ALL" ? undefined : v)}
          />
          <Button type="primary" onClick={() => setOpenAdd(true)}>
            Добавить
          </Button>
        </div>
      }
    >
      <List
        dataSource={filtered}
        renderItem={(p: any) => {
          const id = p.id ?? p._id; // поддержка id и _id
          const canDelete = p.status === "AWAITING_AT_WAREHOUSE";
          return (
            <List.Item
              key={id}
              actions={[
                canDelete ? (
                  <Popconfirm
                    key="delete"
                    title="Удалить посылку?"
                    okText="Да"
                    cancelText="Нет"
                    onConfirm={() => onDelete(id)}
                  >
                    <Button danger>Удалить</Button>
                  </Popconfirm>
                ) : null,
              ].filter(Boolean)}
            >
              <List.Item.Meta title={p.trackingCode} description={p.warehouse ? p.warehouse.name : "—"} />
              <Tag>{STATUS_LABELS[p.status]}</Tag>
            </List.Item>
          );
        }}
      />

      <AddParcelModal open={openAdd} onClose={() => setOpenAdd(false)} onCreated={load} />
    </Card>
  );
}
