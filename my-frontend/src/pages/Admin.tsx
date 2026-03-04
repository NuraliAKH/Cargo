import { Tabs, Typography } from "antd";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { SettingOutlined } from "@ant-design/icons";
import UsersTable from "../feautures/admin/components/UsersTable";
import ParcelsTable from "../feautures/admin/components/ParcelsTable";
import AddressesTable from "../feautures/admin/components/AddressesTable";
import FlightsPage from "../feautures/admin/components/FlightsPage";

const StyledContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
  padding: 24px;
  background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
  border-radius: 14px;
  border-left: 6px solid #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
`;

const TitleIcon = styled.div`
  font-size: 32px;
  color: #1890ff;
  display: flex;
  align-items: center;
`;

const StyledTitle = styled(Typography.Title)`
  && {
    color: #0050b3;
    font-weight: 700;
    margin: 0;
    font-size: 26px;

    @media (max-width: 768px) {
      font-size: 20px;
    }
  }
`;

const TabsContainer = styled.div`
  .ant-tabs {
    background: #ffffff;
    border-radius: 14px;
    padding: 0;
    border: 1px solid #e6f2ff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
  }

  .ant-tabs-nav {
    background: linear-gradient(135deg, #f5f9ff 0%, #f0f5ff 100%);
    border-radius: 14px 14px 0 0;
    border-bottom: 2px solid #e6f2ff;
    margin: 0;
    padding: 12px 20px;

    @media (max-width: 768px) {
      padding: 8px 12px;
    }
  }

  .ant-tabs-tab {
    color: #8c9aad;
    font-weight: 600;
    font-size: 14px;
    padding: 10px 20px;
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin: 0 4px;

    @media (max-width: 768px) {
      padding: 8px 12px;
      font-size: 12px;
    }

    &:hover {
      color: #1890ff;
      background: rgba(24, 144, 255, 0.08);
    }

    &.ant-tabs-tab-active {
      color: #0050b3;
      background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
      border-color: #1890ff;

      .ant-tabs-tab-btn {
        color: #0050b3;
        font-weight: 700;
      }
    }
  }

  .ant-tabs-content {
    padding: 24px;
    border-radius: 0 0 14px 14px;

    @media (max-width: 768px) {
      padding: 16px;
    }
  }

  .ant-tabs-content-holder {
    border-radius: 0 0 14px 14px;
  }
`;

export default function AdminPanel() {
  const { t } = useTranslation();

  return (
    <StyledContainer>
      <HeaderSection>
        <TitleIcon>
          <SettingOutlined />
        </TitleIcon>
        <StyledTitle level={2}>{t("admin.title")}</StyledTitle>
      </HeaderSection>
      
      <TabsContainer>
        <Tabs
          defaultActiveKey="parcels"
          items={[
            { key: "users", label: t("admin.tabs.users"), children: <UsersTable /> },
            { key: "parcels", label: t("admin.tabs.parcels"), children: <ParcelsTable /> },
            { key: "addresses", label: t("admin.tabs.addresses"), children: <AddressesTable /> },
            { key: "flights", label: t("admin.tabs.flights"), children: <FlightsPage /> },
          ]}
        />
      </TabsContainer>
    </StyledContainer>
  );
}
