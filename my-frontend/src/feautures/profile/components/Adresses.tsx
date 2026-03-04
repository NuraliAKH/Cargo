import { useEffect, useState } from "react";
import api from "../../../api";
import { Button, Card, Form, Input, List, message, Popconfirm, Empty, Grid } from "antd";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { DeleteOutlined, PlusOutlined, EnvironmentOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const DeleteButton = styled(Button)`
  color: #ff4d4f !important;
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #fff2f0 !important;
    box-shadow: 0 2px 8px rgba(255, 77, 79, 0.2);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const StyledCard = styled(Card)`
  border-radius: 14px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  background: #fff;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  .ant-card-head {
    background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
    border-bottom: 2px solid #1890ff;
    padding: 20px;
  }

  .ant-card-head-title {
    font-size: 16px;
    font-weight: 700;
    color: #0050b3;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ant-card-body {
    padding: 20px;
  }
`;

const AddressList = styled(List)`
  .ant-list-item {
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    transition: all 0.3s ease;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: linear-gradient(90deg, #f6f9ff 0%, #ffffff 100%);
      padding: 12px 8px;
      margin: 0 -8px;
      border-radius: 6px;
    }
  }

  .ant-list-item-meta {
    align-items: flex-start;
  }

  .ant-list-item-meta-title {
    font-size: 14px;
    font-weight: 700;
    color: #262626;
    margin-bottom: 6px;
  }

  .ant-list-item-meta-description {
    font-size: 12px;
    color: #8c8c8c;
    line-height: 1.5;
  }

  .ant-list-item-action {
    margin-left: 12px;
  }
`;

const FormCard = styled(StyledCard)`
  .ant-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .ant-form-item {
    margin-bottom: 0;

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

    .ant-input {
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
  }

  .ant-btn {
    border-radius: 8px;
    font-weight: 700;
    height: 40px;
    margin-top: 8px;
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

      &:active {
        transform: translateY(0);
      }
    }
  }
`;

const EmptyContainer = styled.div`
  padding: 60px 20px;
  text-align: center;
  background: linear-gradient(135deg, #f6f9ff 0%, #ffffff 100%);
  border-radius: 10px;
  border: 1px dashed #bae7ff;

  .ant-empty-description {
    color: #8c8c8c;
    font-size: 13px;
    font-weight: 500;
  }
`;

const AddressCard = styled.div`
  background: linear-gradient(135deg, #f6f9ff 0%, #ffffff 100%);
  border: 1px solid #e0e8ff;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: linear-gradient(135deg, #e6f7ff 0%, #fff 100%);
    border-color: #1890ff;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
    transform: translateX(4px);
  }

  .address-content {
    flex: 1;
    min-width: 0;
  }

  .address-label {
    font-size: 14px;
    font-weight: 700;
    color: #0050b3;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;

    .icon {
      color: #1890ff;
      font-size: 18px;
    }
  }

  .address-details {
    font-size: 12px;
    color: #595959;
    line-height: 1.6;
    word-break: break-word;
  }

  .address-actions {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
  }
`;

export function Addresses() {
  const { t } = useTranslation();
  const screens = useBreakpoint();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/addresses/my");
      setItems(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onFinish = async (v: any) => {
    try {
      setSubmitting(true);
      await api.post("/api/addresses", v);
      message.success(t("addresses.msgAddSuccess"));
      form.resetFields();
      load();
    } catch {
      message.error(t("addresses.msgAddError"));
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/api/addresses/${id}`);
      message.success(t("addresses.msgDeleteSuccess"));
      load();
    } catch {
      message.error(t("addresses.msgDeleteError"));
    }
  };

  return (
    <Container>
      {/* My Addresses */}
      <StyledCard
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <EnvironmentOutlined />
            {t("addresses.titleMy")}
          </div>
        }
        loading={loading}
      >
        {items.length === 0 ? (
          <EmptyContainer>
            <Empty description={t("addresses.titleMy")} style={{ marginTop: 20 }} />
          </EmptyContainer>
        ) : (
          <AddressList
            dataSource={items}
            renderItem={(a: any) => (
              <AddressCard key={a.id ?? a._id}>
                <div className="address-content">
                  <div className="address-label">
                    <EnvironmentOutlined className="icon" />
                    {a.label}
                  </div>
                  <div className="address-details">
                    {a.line1}
                    {a.line2 && <>, {a.line2}</>}
                    <br />
                    {a.city}, {a.country}
                  </div>
                </div>
                <div className="address-actions">
                  <Popconfirm
                    title={t("addresses.confirmDelete")}
                    onConfirm={() => remove(a.id ?? a._id)}
                    okText={t("common.yes")}
                    cancelText={t("common.no")}
                  >
                    <DeleteButton danger size="small" icon={<DeleteOutlined />} type="text" />
                  </Popconfirm>
                </div>
              </AddressCard>
            )}
          />
        )}
      </StyledCard>

      {/* Add Address Form */}
      <FormCard
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PlusOutlined />
            {t("addresses.titleAdd")}
          </div>
        }
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="label"
            label={t("addresses.fieldLabel")}
            rules={[{ required: true, message: t("addresses.errLabel") }]}
          >
            <Input placeholder={t("addresses.phLabel")} />
          </Form.Item>
          <Form.Item
            name="line1"
            label={t("addresses.fieldLine1")}
            rules={[{ required: true, message: t("addresses.errLine1") }]}
          >
            <Input placeholder="123 Main Street" />
          </Form.Item>
          <Form.Item name="line2" label={t("addresses.fieldLine2")}>
            <Input placeholder="Apt. 456" />
          </Form.Item>
          <Form.Item
            name="city"
            label={t("addresses.fieldCity")}
            rules={[{ required: true, message: t("addresses.errCity") }]}
          >
            <Input placeholder="New York" />
          </Form.Item>
          <Form.Item
            name="country"
            label={t("addresses.fieldCountry")}
            rules={[{ required: true, message: t("addresses.errCountry") }]}
          >
            <Input placeholder="United States" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting} block size="large" icon={<PlusOutlined />}>
            {t("common.save")}
          </Button>
        </Form>
      </FormCard>
    </Container>
  );
}
