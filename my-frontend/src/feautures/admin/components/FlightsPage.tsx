import { useEffect, useState } from "react";
import { Button, Card, Modal, Form, Input, DatePicker, Select, Table, message, Popconfirm, Tag, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { PlusOutlined, EditOutlined, DeleteOutlined, RocketOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import api from "../../../api";

const { RangePicker } = DatePicker;

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

const HeaderCard = styled(Card)`
  && {
    border-radius: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: none;
    margin-bottom: 24px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .ant-card-head {
      background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
      border-bottom: 2px solid #1890ff;
      padding: 20px 24px;
    }

    .ant-card-head-title {
      color: #0050b3;
      font-weight: 700;
      font-size: 18px;
    }
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
      border-color: #1890ff;
      color: #1890ff;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
    }

    &.ant-btn-dangerous:hover {
      border-color: #ff4d4f;
      color: #ff4d4f;
      box-shadow: 0 2px 8px rgba(255, 77, 79, 0.15);
    }
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
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

export default function FlightsPage() {
  const { t } = useTranslation();
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/flights");
      setFlights(res.data);
    } catch {
      message.error(t("flights.errors.load"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (values: any) => {
    try {
      const payload = {
        code: values.code,
        status: values.status,
        departureAt: values.dates[0],
        arrivalAt: values.dates[1] || null,
        departureFrom: values.departureFrom,
        arrivalTo: values.arrivalTo,
      };

      if (editing) {
        await api.put(`/api/flights/${editing.id}`, payload);
        message.success(t("flights.updated"));
      } else {
        await api.post("/api/flights", payload);
        message.success(t("flights.created"));
      }

      setOpenModal(false);
      form.resetFields();
      setEditing(null);
      load();
    } catch {
      message.error(t("flights.errors.save"));
    }
  };

  const onDelete = async (id: number) => {
    try {
      await api.delete(`/api/flights/${id}`);
      message.success(t("flights.deleted"));
      load();
    } catch {
      message.error(t("flights.errors.delete"));
    }
  };

  const columns = [
    { title: t("flights.columns.code"), dataIndex: "code", width: 100 },
    {
      title: t("flights.columns.status"),
      dataIndex: "status",
      width: 140,
      render: (s: string) => <Tag>{t(`flights2.status.${s}`)}</Tag>,
    },
    { title: t("flights.columns.departureFrom"), dataIndex: "departureFrom", width: 120 },
    { title: t("flights.columns.arrivalTo"), dataIndex: "arrivalTo", width: 120 },
    {
      title: t("flights.columns.departureAt"),
      dataIndex: "departureAt",
      width: 160,
      render: (d: string) => new Date(d).toLocaleString(),
    },
    {
      title: t("flights.columns.arrivalAt"),
      dataIndex: "arrivalAt",
      width: 160,
      render: (d: string) => (d ? new Date(d).toLocaleString() : "-"),
    },
    {
      title: t("flights.columns.actions"),
      width: 80,
      fixed: "right",
      render: (_: any, record: any) => (
        <ActionsContainer>
          <Tooltip title={t("flights.edit")}>
            <ActionButton
              icon={<EditOutlined />}
              onClick={() => {
                setEditing(record);
                form.setFieldsValue({
                  code: record.code,
                  status: record.status,
                  departureFrom: record.departureFrom,
                  arrivalTo: record.arrivalTo,
                  dates: [
                    record.departureAt ? dayjs(record.departureAt) : null,
                    record.arrivalAt ? dayjs(record.arrivalAt) : null,
                  ].filter(Boolean),
                });
                setOpenModal(true);
              }}
            />
          </Tooltip>
          <Popconfirm title={t("flights.confirmDelete")} onConfirm={() => onDelete(record.id)}>
            <Tooltip title={t("flights.delete")}>
              <ActionButton danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </ActionsContainer>
      ),
    },
  ];

  return (
    <Container>
      <HeaderSection>
        <HeaderTitle>
          <RocketOutlined className="icon" />
          {t("flights.title")}
        </HeaderTitle>
        <AddButton type="primary" icon={<PlusOutlined />} onClick={() => setOpenModal(true)}>
          {t("flights.add")}
        </AddButton>
      </HeaderSection>

      <StyledTable
        rowKey="id"
        columns={columns as any}
        dataSource={flights}
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        scroll={{ x: 1000 }}
      />

      <StyledModal
        title={editing ? t("flights.edit") : t("flights.add")}
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
          setEditing(null);
          form.resetFields();
        }}
        footer={[
          <ModalButton
            key="cancel"
            onClick={() => {
              setOpenModal(false);
              setEditing(null);
              form.resetFields();
            }}
          >
            {t("common.no")}
          </ModalButton>,
          <ModalButton key="submit" type="primary" onClick={() => form.submit()}>
            {t("common.save")}
          </ModalButton>,
        ]}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={onSubmit}>
          <Form.Item name="code" label={t("flights.form.code")}>
            <Input placeholder="HY123" />
          </Form.Item>

          <Form.Item name="status" label={t("flights.form.status")} initialValue="SCHEDULED">
            <Select
              options={[
                { value: "SCHEDULED", label: t("flights2.status.SCHEDULED") },
                { value: "DEPARTED", label: t("flights2.status.DEPARTED") },
                { value: "ARRIVED", label: t("flights2.status.ARRIVED") },
                { value: "CANCELLED", label: t("flights2.status.CANCELLED") },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="departureFrom"
            label={t("flights.form.departureFrom")}
            rules={[{ required: true, message: t("flights.form.departureFromRequired") }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="arrivalTo"
            label={t("flights.form.arrivalTo")}
            rules={[{ required: true, message: t("flights.form.arrivalToRequired") }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="dates"
            label={t("flights.form.dates")}
            rules={[{ required: true, message: t("flights.form.datesRequired") }]}
          >
            <RangePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </StyledModal>
    </Container>
  );
}
