// components/HeroSection.tsx
import { Link } from "react-router-dom";
import { Button, Typography } from "antd";
import { useTranslation } from "react-i18next";
import "./HeroSection.css";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section id="main" className="hero-section">
      <div className="content">
        <Typography.Title>{t("hero.title")}</Typography.Title>
        <Typography.Paragraph>{t("hero.subtitle")}</Typography.Paragraph>
        <div className="actions">
          <Link to="https://my.airexpress.uz/auth?tab=login">
            <Button type="primary">{t("hero.login")}</Button>
          </Link>
          <Link to="https://my.airexpress.uz/auth?tab=register">
            <Button>{t("hero.register")}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
