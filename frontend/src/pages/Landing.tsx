import { Card, Row, Col, Typography, Button } from "antd";
import HeroSection from "../feautures/landing/components/HeroSection";
import FlightsList from "../feautures/landing/components/FlightsList";
import HowItWorksSection from "../feautures/landing/components/HowItWorks";
import ServicesSection from "../feautures/landing/components/ServicesSection";
export default function Landing() {
  return (
    <div className="m-0">
      <HeroSection />
      <HowItWorksSection />
      <section id="flights" className="max-w-6xl mx-auto py-12">
        <FlightsList />
      </section>
      <section id="services" className="max-w-6xl mx-auto py-12">
        <ServicesSection />
      </section>
    </div>
  );
}
