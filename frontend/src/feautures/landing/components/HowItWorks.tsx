import React from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const stepsIcons = [
  "https://turonexpress.com/cdn/img/app/cabinet/index/hw-register.png",
  "https://turonexpress.com/cdn/img/app/cabinet/index/hw-shopping.png",
  "https://turonexpress.com/cdn/img/app/cabinet/index/hw-product.png",
  "https://turonexpress.com/cdn/img/app/cabinet/index/hw-give.png",
];

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const StyledCard = styled.div<{ delay: number }>`
  background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  padding: 28px;
  text-align: left;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${fadeInUp} 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: ${props => props.delay}ms;
  opacity: 0;
  cursor: pointer;
  position: relative;
  border: 2px solid transparent;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(24, 144, 255, 0.1), transparent);
    transform: rotate(45deg);
    transition: all 0.6s;
  }

  &:hover {
    transform: translateY(-12px) scale(1.03);
    box-shadow: 0 20px 50px rgba(24, 144, 255, 0.25), 0 0 30px rgba(24, 144, 255, 0.1);
    border-color: #1890ff;
    background: linear-gradient(135deg, #ffffff 0%, #e6f7ff 100%);

    &::before {
      left: 100%;
    }
    
    img {
      animation: ${float} 2s ease-in-out infinite;
      filter: drop-shadow(0 8px 16px rgba(24, 144, 255, 0.3));
    }
  }

  img {
    width: 64px;
    height: 64px;
    margin-bottom: 16px;
    margin-left: auto;
    margin-right: auto;
    display: block;
    transition: transform 0.3s ease;
  }

  h3 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 10px;
    color: #0050b3;
    transition: color 0.3s ease;
  }

  &:hover h3 {
    color: #1890ff;
    text-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
  }

  p {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
    line-height: 1.7;
    transition: color 0.3s ease;
  }

  &:hover p {
    color: #333;
  }

  a {
    color: #1890ff;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #0050b3;
      text-decoration: underline;
    }
  }
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #0050b3;
  animation: ${fadeInUp} 0.8s cubic-bezier(0.4, 0, 0.2, 1);
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 40px;
  font-size: 16px;
  animation: ${fadeInUp} 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s backwards;
`;

export default function HowItWorksSection() {
  const { t } = useTranslation();
  const steps = t("howItWorks.steps", { returnObjects: true }) as Array<{
    title: string;
    description: string;
    link?: string;
  }>;

  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-4 py-12 text-center">
      <Title>{t("howItWorks.title")}</Title>
      <Subtitle>{t("howItWorks.subtitle")}</Subtitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <StyledCard key={index} delay={index * 100}>
            <img src={stepsIcons[index]} alt={step.title} />
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            {step.link && (
              <a href="#">{step.link}</a>
            )}
          </StyledCard>
        ))}
      </div>
    </section>
  );
}
