import { Layout, Row, Col, Typography, Space } from "antd";
import { MailOutlined, PhoneOutlined, InstagramOutlined, FacebookFilled, SendOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Footer } = Layout;
const { Text, Title, Link } = Typography;

export default function AppFooter() {
  const { t } = useTranslation();

  return (
    <Footer style={{ borderTop: "1px solid #e8e8e8", padding: "40px 20px" }}>
      <Row gutter={[32, 32]} justify="space-between" align="top">
        {/* Логотип и копирайт */}
        <Col xs={24} md={8} style={{ textAlign: "center", textAlignLast: "left" }}>
          <img src="/logo.png" alt="Airexpress Logo" style={{ width: 120, marginBottom: 16 }} aria-disabled />
          <Text>
            © {new Date().getFullYear()} Airexpress. {t("footer.rights")}
          </Text>
        </Col>

        {/* Контакты */}
        <Col xs={24} sm={12} md={8} style={{ textAlign: "center", textAlignLast: "left" }}>
          <Title level={5}>{t("footer.contacts")}</Title>
          <Space direction="vertical">
            <Text>
              <MailOutlined /> info@airexpress.uz
            </Text>
            <Text>
              <PhoneOutlined /> +998 71 200 40 43
            </Text>
          </Space>
        </Col>

        {/* Соцсети */}
        <Col xs={24} sm={12} md={8} style={{ textAlign: "center", textAlignLast: "left" }}>
          <Title level={5}>{t("footer.social")}</Title>
          <Space size="large">
            <Link href="https://t.me/airexpressuz" target="_blank">
              <SendOutlined style={{ fontSize: 22, color: "#08c" }} />
            </Link>
            <Link href="https://instagram.com/airexpress.uz" target="_blank">
              <InstagramOutlined style={{ fontSize: 22, color: "#E4405F" }} />
            </Link>
            <Link href="https://fb.com/airexpressuzbekistan" target="_blank">
              <FacebookFilled style={{ fontSize: 22, color: "#1877F2" }} />
            </Link>
          </Space>
        </Col>
      </Row>
    </Footer>
  );
}
