import { Table, Button, Modal, Form, Input, InputNumber, message, Tooltip, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { PlusOutlined, DeleteOutlined, DatabaseOutlined } from "@ant-design/icons";
import api from "../../../api";

const Container = styled.div`
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
  border-radius: 12px;
  border-left: 5px solid #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeaderTitle = styled.h2`
  margin: 0;
  color: #0050b3;
  font-weight: 700;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 10px;

  .icon {
    color: #1890ff;
    font-size: 24px;
  }
`;

const AddButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    height: 40px;
    padding: 0 20px;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }
`;

const StyledTable = styled(Table)`
  .ant-table {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ant-table-thead > tr > th {
    background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
    color: #0050b3;
    font-weight: 700;
    border-bottom: 2px solid #1890ff;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.5px;
  }

  .ant-table-tbody > tr {
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(90deg, #f6f9ff 0%, #ffffff 100%);
      box-shadow: inset 0 2px 8px rgba(24, 144, 255, 0.08);
    }

    > td {
      padding: 14px 16px;
      color: #262626;
      font-size: 13px;
    }
  }

  .ant-table-pagination {
    margin-top: 20px;
    padding: 0 16px;
  }
`;

const ActionButton = styled(Button)`
  && {
    border-radius: 6px;
    padding: 4px 8px;
    font-size: 12px;
    height: 28px;
    width: 28px;
    color: #8c9aad;
    border: 1px solid transparent;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: transparent;
      border-color: #ff4d4f;
      color: #ff4d4f;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(255, 77, 79, 0.15);
    }
  }
`;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 12px;
    overflow: hidden;
  }

  .ant-modal-header {
    background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
    border-bottom: 2px solid #1890ff;
    padding: 20px 24px;
  }

  .ant-modal-title {
    color: #0050b3;
    font-weight: 700;
    font-size: 16px;
  }

  .ant-form-item-label > label {
    color: #0050b3;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.5px;
  }

  .ant-input,
  .ant-input-number,
  .ant-select-selector {
    border-radius: 8px;
    border: 1.5px solid #e6f2ff;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover,
    &:focus {
      border-color: #1890ff;
      box-shadow: 0 0 8px rgba(24, 144, 255, 0.2);
    }
  }

  .ant-modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #e6f2ff;
  }
`;

const ModalButton = styled(Button)`
  && {
    border-radius: 8px;
    font-weight: 600;
    height: 36px;
    padding: 0 20px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &.ant-btn-primary {
      background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
      border: none;
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
      }
    }
  }
`;

export default function WarehousesTable() {
  const { t } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const load = () => api.get("/api/warehouses").then(r => setData(r.data));

  useEffect(() => {
    load();
  }, []);

  const onCreate = () => {
    form.validateFields().then(values => {
      api.post("/api/warehouses", values).then(() => {
        message.success(t("warehouses.added"));
        setOpen(false);
        form.resetFields();
        load();
      });
    });
  };

  const onDelete = (id: number) => {
    api.delete(`/api/warehouses/${id}`).then(() => {
      message.success(t("warehouses.deleted"));
      load();
    });
  };

  return (
    <Container>
      <HeaderSection>
        <HeaderTitle>
          <DatabaseOutlined className="icon" />
          {t("warehouses.addWarehouse")}
        </HeaderTitle>
        <AddButton type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          {t("warehouses.addWarehouse")}
        </AddButton>
      </HeaderSection>

      <StyledTable
        rowKey="id"
        dataSource={data}
        scroll={{ x: 1000 }}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        columns={[
          { title: t("warehouses.columns.id"), dataIndex: "id", width: 60 },
          { title: t("warehouses.columns.name"), dataIndex: "name", width: 120 },
          { title: t("warehouses.columns.location"), dataIndex: "location", width: 120 },
          { title: t("warehouses.columns.firstName"), dataIndex: "firstName", width: 110 },
          { title: t("warehouses.columns.lastName"), dataIndex: "lastName", width: 110 },
          { title: t("warehouses.columns.addresLine1"), dataIndex: "addresLine1", width: 140 },
          { title: t("warehouses.columns.addresLine2"), dataIndex: "addresLine2", width: 140 },
          { title: t("warehouses.columns.city"), dataIndex: "city", width: 100 },
          { title: t("warehouses.columns.state"), dataIndex: "state", width: 100 },
          { title: t("warehouses.columns.zipcode"), dataIndex: "zipcode", width: 100 },
          { title: t("warehouses.columns.telephone"), dataIndex: "telephone", width: 120 },
          { title: t("warehouses.columns.cell"), dataIndex: "cell", width: 120 },
          {
            title: t("warehouses.columns.actions"),
            width: 80,
            fixed: "right",
            render: (_, record: any) => (
              <Popconfirm
                title={t("warehouses.delete")}
                onConfirm={() => onDelete(record.id)}
                okText={t("common.yes")}
                cancelText={t("common.no")}
              >
                <Tooltip title={t("warehouses.delete")}>
                  <ActionButton danger icon={<DeleteOutlined />} />
                </Tooltip>
              </Popconfirm>
            ),
          },
        ]}
      />

      <StyledModal
        title={t("warehouses.modalTitle")}
        open={open}
        onCancel={() => setOpen(false)}
        footer={[
          <ModalButton key="cancel" onClick={() => setOpen(false)}>
            {t("common.no")}
          </ModalButton>,
          <ModalButton key="submit" type="primary" onClick={onCreate}>
            {t("common.save")}
          </ModalButton>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={t("warehouses.form.name")}
            rules={[{ required: true, message: t("warehouses.form.nameRequired") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="location" label={t("warehouses.form.location")}>
            <Input />
          </Form.Item>
          <Form.Item name="firstName" label={t("warehouses.form.firstName")}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label={t("warehouses.form.lastName")}>
            <Input />
          </Form.Item>
          <Form.Item name="addresLine1" label={t("warehouses.form.addresLine1")}>
            <Input />
          </Form.Item>
          <Form.Item name="addresLine2" label={t("warehouses.form.addresLine2")}>
            <Input />
          </Form.Item>
          <Form.Item name="city" label={t("warehouses.form.city")}>
            <Input />
          </Form.Item>
          <Form.Item name="state" label={t("warehouses.form.state")}>
            <Input />
          </Form.Item>
          <Form.Item name="zipcode" label={t("warehouses.form.zipcode")}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="telephone" label={t("warehouses.form.telephone")}>
            <Input />
          </Form.Item>
          <Form.Item name="cell" label={t("warehouses.form.cell")}>
            <Input />
          </Form.Item>
        </Form>
      </StyledModal>
    </Container>
  );
}
