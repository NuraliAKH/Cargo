import { Table, Button, Modal, Form, Input, Select, message, Tooltip, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import api from "../../../api";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { PlusOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";

const Container = styled.div`
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
  border-radius: 12px;
  border-left: 5px solid #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
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

export default function UsersTable() {
  const { t } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const load = () => api.get("/api/users").then(r => setData(r.data));

  useEffect(() => {
    load();
  }, []);

  const onCreate = () => {
    form.validateFields().then(values => {
      api.post("/api/users", values).then(() => {
        message.success(t("users.created"));
        setOpen(false);
        form.resetFields();
        load();
      });
    });
  };

  const onRoleChange = async (id: number, role: string) => {
    try {
      await api.put(`/api/users/${id}/role`, { role });
      message.success(t("users.role_changed"));
      load();
    } catch {
      message.error(t("users.role_change_error"));
    }
  };

  return (
    <Container>
      <HeaderSection>
        <HeaderTitle>
          <UserOutlined className="icon" />
          {t("users.add")}
        </HeaderTitle>
        <div style={{ marginLeft: "auto" }}>
          <AddButton type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
            {t("users.add")}
          </AddButton>
        </div>
      </HeaderSection>

      <StyledTable
        rowKey="id"
        scroll={{ x: 600 }}
        dataSource={data}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        columns={[
          { title: t("users.phone"), dataIndex: "phone", width: 120 },
          { title: t("users.name"), dataIndex: "name", width: 150 },
          {
            title: t("users.role"),
            dataIndex: "role",
            width: 140,
            render: (role: string, record: any) => (
              <Select
                value={role}
                onChange={newRole => onRoleChange(record.id, newRole)}
                options={[
                  { value: "USER", label: t("users.roles.user") },
                  { value: "ADMIN", label: t("users.roles.admin") },
                ]}
                style={{ width: "100%" }}
              />
            ),
          },
          {
            title: t("users.actions"),
            width: 100,
            fixed: "right",
            render: (_, record: any) => (
              <Popconfirm
                title={t("common.delete")}
                onConfirm={() => {
                  api.delete(`/api/users/${record.id}`).then(() => {
                    message.success(t("users.deleted"));
                    load();
                  });
                }}
                okText={t("common.yes")}
                cancelText={t("common.no")}
              >
                <Tooltip title={t("users.delete")}>
                  <ActionButton danger icon={<DeleteOutlined />} />
                </Tooltip>
              </Popconfirm>
            ),
          },
        ]}
      />

      <StyledModal
        title={t("users.create_modal")}
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
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="email" label={t("users.email")} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label={t("users.password")} rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="role" label={t("users.role")} initialValue="USER" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "USER", label: t("users.roles.user") },
                { value: "ADMIN", label: t("users.roles.admin") },
              ]}
            />
          </Form.Item>
        </Form>
      </StyledModal>
    </Container>
  );
}
