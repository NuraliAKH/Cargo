import { Card, Row, Col, Typography, Button } from "antd";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import HeroSection from "../feautures/landing/components/HeroSection";
import FlightsList from "../feautures/landing/components/FlightsList";
import HowItWorksSection from "../feautures/landing/components/HowItWorks";
import ServicesSection from "../feautures/landing/components/ServicesSection";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedSection = styled.section<{ delay?: number }>`
  animation: ${fadeIn} 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: ${props => props.delay || 0}ms;
  opacity: 0;
`;

export default function Landing() {
  return (
    <div className="m-0">
      <HeroSection />
      <AnimatedSection delay={200}>
        <HowItWorksSection />
      </AnimatedSection>
      <AnimatedSection delay={400} id="flights" className="max-w-6xl mx-auto py-12">
        <FlightsList />
      </AnimatedSection>
      <AnimatedSection delay={600} id="services" className="max-w-6xl mx-auto py-12">
        <ServicesSection />
      </AnimatedSection>
    </div>
  );
}
