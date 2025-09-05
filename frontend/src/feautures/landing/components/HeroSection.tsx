// components/HeroSection.tsx
import { Link } from "react-router-dom";
import { Button, Typography } from "antd";
import "./HeroSection.css"; // Стили вынесем отдельно

const HeroSection = () => {
  return (
    <section id="main" className="hero-section">
      <div className="content">
        <Typography.Title>Быстрая и надёжная карго-доставка</Typography.Title>
        <Typography.Paragraph>Отслеживайте посылки, управляйте адресами и получайте уведомления.</Typography.Paragraph>
        <div className="actions">
          <Link to="/auth?tab=login">
            <Button type="primary">Войти</Button>
          </Link>
          <Link to="/auth?tab=register">
            <Button>Зарегистрироваться</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
