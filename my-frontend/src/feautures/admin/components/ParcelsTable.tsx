import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, DatePicker, Space, Tooltip } from "antd";
import { useEffect, useMemo, useState } from "react";
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import api from "../../../api";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";

const { RangePicker } = DatePicker;

const Container = styled.div`
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const FilterSection = styled(Space)`
  && {
    width: 100%;
    margin-bottom: 20px;
    padding: 20px;
    background: linear-gradient(135deg, #f5f9ff 0%, #f0f5ff 100%);
    border-radius: 12px;
    border: 1px solid #e6f2ff;
    display: flex;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      flex-direction: column;
      padding: 12px;

      > * {
        width: 100% !important;
      }
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

const ReloadButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #f0f5ff 0%, #e6f0ff 100%);
    border: 1px solid #e6f2ff;
    color: #1890ff;
    font-weight: 600;
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      border-color: #1890ff;
      background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
      transform: rotate(180deg);
    }
  }
`;

const AddButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    height: 36px;
    padding: 0 16px;
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

interface Parcel {
  user: any;
  id: number;
  trackingCode: string;
  status: string;
  owner?: { email: string };
  warehouse?: { name: string };
  createdAt?: string;
}

export default function ParcelsTable() {
  const { t } = useTranslation();
  const [data, setData] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParcel, setEditingParcel] = useState<Parcel | null>(null);
  const [form] = Form.useForm();

  const [emailFilter, setEmailFilter] = useState("");
  const [trackingFilter, setTrackingFilter] = useState("");
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  const STATUS_OPTIONS = useMemo(
    () =>
      Object.entries(t("parcels.statuses", { returnObjects: true }) as Record<string, string>).map(
        ([value, label]) => ({
          value,
          label,
        })
      ),
    [t]
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/parcels");
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const emailMatch = emailFilter ? item.user?.email?.toLowerCase().includes(emailFilter.toLowerCase()) : true;
      const trackingMatch = trackingFilter
        ? item.trackingCode.toLowerCase().includes(trackingFilter.toLowerCase())
        : true;
      const dateMatch = dateRange
        ? item.createdAt &&
          dayjs(item.createdAt).isAfter(dateRange[0].startOf("day")) &&
          dayjs(item.createdAt).isBefore(dateRange[1].endOf("day"))
        : true;

      return emailMatch && trackingMatch && dateMatch;
    });
  }, [data, emailFilter, trackingFilter, dateRange]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingParcel) {
        await api.patch(`/api/parcels/${editingParcel.id}`, values);
        message.success(t("parcels.updated"));
      } else {
        await api.post("/api/parcels", values);
        message.success(t("parcels.created"));
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/api/parcels/${id}`);
    message.success(t("parcels.deleted"));
    await loadData();
  };

  return (
    <Container>
      <FilterSection align="center">
        <Input
          placeholder={t("parcels.filters.search_email")}
          value={emailFilter}
          onChange={e => setEmailFilter(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Input
          placeholder={t("parcels.filters.search_tracking")}
          value={trackingFilter}
          onChange={e => setTrackingFilter(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <RangePicker onChange={dates => setDateRange(dates as [Dayjs, Dayjs] | null)} />
        <ReloadButton icon={<ReloadOutlined />} onClick={loadData}>
          {t("parcels.update")}
        </ReloadButton>
        <div style={{ marginLeft: "auto" }}>
          <AddButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingParcel(null);
              form.resetFields();
              setIsModalOpen(true);
            }}
          >
            {t("parcels.create")}
          </AddButton>
        </div>
      </FilterSection>

      <StyledTable
        dataSource={filteredData}
        rowKey="id"
        loading={loading}
        scroll={{ x: 800 }}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        style={{ minHeight: 400 }}
        columns={[
          { title: t("parcels.tracking_code"), dataIndex: "trackCode", width: 140 },
          {
            title: t("parcels.owner"),
            dataIndex: "recipient",
            width: 180,
            render: (v: any) => `${v.firstName}  ${v.lastName}` || "—",
          },
          { title: t("parcels.warehouse"), dataIndex: ["warehouse", "name"], width: 150, render: (v: any) => v || "—" },
          {
            title: t("parcels.status"),
            dataIndex: "status",
            width: 180,
            render: (status: any, record: any) => (
              <Select
                value={status}
                style={{ width: "100%" }}
                options={STATUS_OPTIONS}
                onChange={async value => {
                  await api.patch(`/api/parcels/${record.id}/status`, { status: value });
                  message.success(t("parcels.updated"));
                  await loadData();
                }}
              />
            ),
          },
          {
            title: t("parcels.created_at"),
            dataIndex: "createdAt",
            width: 160,
            render: (v: any) => (v ? dayjs(v).format("YYYY-MM-DD HH:mm") : "—"),
          },
          {
            title: t("flights.actions"),
            width: 80,
            fixed: "right",
            render: (_: any, record: any) => (
              <Space size="small">
                <Tooltip title={t("parcels.edit")}>
                  <ActionButton
                    icon={<EditOutlined />}
                    onClick={() => {
                      setEditingParcel(record);
                      form.setFieldsValue(record);
                      setIsModalOpen(true);
                    }}
                  />
                </Tooltip>
                <Popconfirm title={t("parcels.delete")} onConfirm={() => handleDelete(record.id)}>
                  <Tooltip title={t("parcels.delete")}>
                    <ActionButton danger icon={<DeleteOutlined />} />
                  </Tooltip>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <StyledModal
        title={editingParcel ? t("parcels.edit") : t("parcels.create")}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <ModalButton key="cancel" onClick={() => setIsModalOpen(false)}>
            {t("common.no")}
          </ModalButton>,
          <ModalButton key="submit" type="primary" onClick={handleSave}>
            {t("common.save")}
          </ModalButton>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="trackingCode"
            label={t("parcels.tracking_code")}
            rules={[
              { required: true, message: t("parcels.enter_tracking_code", { defaultValue: "Enter tracking code" }) },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="status" label={t("parcels.status")} initialValue="AWAITING_AT_WAREHOUSE">
            <Select options={STATUS_OPTIONS} />
          </Form.Item>
        </Form>
      </StyledModal>
    </Container>
  );
}
