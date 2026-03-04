import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Popconfirm,
  message,
  Card,
  Grid,
  Empty,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import api from "../../../api";
import styled from "@emotion/styled";
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";

const { Option } = Select;
const { useBreakpoint } = Grid;

export type RecipientType = "INDIVIDUAL" | "COMPANY";

interface Recipient {
  id: number;
  type: RecipientType;
  firstName: string;
  lastName: string;
  middleName?: string;
  passportSeries: string;
  passportNumber: string;
  jshshir: string;
  phone?: string;
  addressLine1?: string;
  city?: string;
  country?: string;
  createdAt: string;
}

/* === Styled Components === */
const Container = styled.div`
  width: 100%;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #0050b3;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;

  .icon {
    color: #1890ff;
    font-size: 24px;
  }
`;

const AddButton = styled(Button)`
  border-radius: 8px;
  font-weight: 700;
  height: 40px;
  padding: 0 20px;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);

  &:hover {
    background: linear-gradient(135deg, #0050b3 0%, #003a8c 100%);
    box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
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

      a {
        color: #1890ff;
        font-weight: 600;

        &:hover {
          color: #0050b3;
        }
      }
    }
  }

  .ant-table-pagination {
    margin-top: 20px;
  }
`;

const ActionButtonsWrapper = styled(Space)`
  display: flex;
  gap: 8px;
`;

const EditButton = styled(Button)`
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
    border-color: #1890ff;
    color: #1890ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
  }
`;

const DeleteButton = styled(Button)`
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
`;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  }

  .ant-modal-header {
    background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
    border-bottom: 2px solid #1890ff;
    border-radius: 12px 12px 0 0;
    padding: 20px;
  }

  .ant-modal-title {
    font-size: 16px;
    font-weight: 700;
    color: #0050b3;
  }

  .ant-modal-body {
    padding: 24px;
  }

  .ant-form {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .ant-form-item {
    margin-bottom: 16px;

    .ant-form-item-label {
      padding-bottom: 8px;

      label {
        font-size: 12px;
        font-weight: 700;
        color: #0050b3;
        text-transform: uppercase;
        letter-spacing: 0.6px;
      }
    }

    .ant-input,
    .ant-select-selector {
      border-radius: 8px;
      border: 1.5px solid #d9e8ff;
      padding: 10px 14px;
      font-size: 13px;
      background: linear-gradient(180deg, #fafbff 0%, #ffffff 100%);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        border-color: #1890ff;
        background: #ffffff;
      }

      &:focus,
      &:focus-visible {
        border-color: #1890ff;
        box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.12);
        background: #ffffff;
      }
    }

    .ant-select-focused .ant-select-selector {
      border-color: #1890ff;
      box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.12);
    }
  }

  .ant-modal-footer {
    padding: 12px 24px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
`;

const ModalButton = styled(Button)`
  border-radius: 8px;
  font-weight: 700;
  height: 36px;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.ant-btn-primary {
    background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
    border-color: transparent;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);

    &:hover {
      background: linear-gradient(135deg, #0050b3 0%, #003a8c 100%);
      box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
      transform: translateY(-2px);
    }
  }

  &.ant-btn-default {
    border: 1px solid #d9d9d9;

    &:hover {
      border-color: #1890ff;
      color: #1890ff;
    }
  }
`;

const RecipientTable: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Recipient | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    const res = await api.get<Recipient[]>("/api/recipients/my");
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdate = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await api.put(`/api/recipients/${editing.id}`, values);
        message.success(t("recipients.updateSuccess"));
      } else {
        await api.post(`/api/recipients`, values);
        message.success(t("recipients.createSuccess"));
      }
      setOpen(false);
      setEditing(null);
      form.resetFields();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/api/recipients/${id}`);
    message.success(t("recipients.deleteSuccess"));
    fetchData();
  };

  const columns: ColumnsType<Recipient> = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: t("recipients.type"), dataIndex: "type", key: "type", width: 40 },
    { title: t("recipients.firstName"), dataIndex: "firstName", key: "firstName" },
    { title: t("recipients.lastName"), dataIndex: "lastName", key: "lastName" },
    { title: "JSHSHIR", dataIndex: "jshshir", key: "jshshir" },
    { title: t("recipients.phone"), dataIndex: "phone", key: "phone" },
    { title: t("recipients.city"), dataIndex: "city", key: "city" },
    { title: t("recipients.country"), dataIndex: "country", key: "country" },
    {
      title: t("recipients.actions"),
      key: "actions",
      render: (_, record) => (
        <ActionButtonsWrapper size="small">
          <Tooltip title={t("recipients.edit")}>
            <EditButton
              type="primary"
              ghost
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditing(record);
                setOpen(true);
                form.setFieldsValue(record);
              }}
            />
          </Tooltip>
          <Popconfirm
            title={t("recipients.confirmDelete")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("recipients.yes")}
            cancelText={t("recipients.no")}
          >
            <Tooltip title={t("recipients.delete")}>
              <DeleteButton danger size="small" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </ActionButtonsWrapper>
      ),
    },
  ];

  return (
    <Container>
      <HeaderSection>
        <Title>
          <UserOutlined className="icon" />
          {t("recipients.title")}
        </Title>
        <AddButton
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditing(null);
            setOpen(true);
            form.resetFields();
          }}
        >
          {t("recipients.add")}
        </AddButton>
      </HeaderSection>

      <StyledTable
        columns={columns as any}
        dataSource={data}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 10,
          total: data.length,
          showSizeChanger: true,
          showTotal: total => `${total} ${t("recipients.total")}`,
        }}
        locale={{
          emptyText: <Empty description={t("recipients.noData")} />,
        }}
      />

      <StyledModal
        title={editing ? t("recipients.editTitle") : t("recipients.createTitle")}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        footer={[
          <ModalButton
            key="cancel"
            onClick={() => {
              setOpen(false);
              setEditing(null);
              form.resetFields();
            }}
          >
            {t("cancel")}
          </ModalButton>,
          <ModalButton key="submit" type="primary" onClick={handleCreateOrUpdate}>
            {editing ? t("recipients.update") : t("recipients.add")}
          </ModalButton>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="type" label={t("recipients.type")} rules={[{ required: true }]}>
            <Select>
              <Option value="INDIVIDUAL">{t("recipients.individual")}</Option>
              <Option value="COMPANY">{t("recipients.company")}</Option>
            </Select>
          </Form.Item>
          <Form.Item name="passportSeries" label={t("recipients.passportSeries")} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="passportNumber" label={t("recipients.passportNumber")} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="firstName" label={t("recipients.firstName")} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label={t("recipients.lastName")} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="middleName" label={t("recipients.middleName")}>
            <Input />
          </Form.Item>
          <Form.Item name="jshshir" label="JSHSHIR" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label={t("recipients.phone")}>
            <Input />
          </Form.Item>
          <Form.Item name="addressLine1" label={t("recipients.address")}>
            <Input />
          </Form.Item>
          <Form.Item name="city" label={t("recipients.city")}>
            <Input />
          </Form.Item>
          <Form.Item name="country" label={t("recipients.country")}>
            <Input />
          </Form.Item>
        </Form>
      </StyledModal>
    </Container>
  );
};

export default RecipientTable;
