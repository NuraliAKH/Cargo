import React from "react";
import { useTranslation } from "react-i18next";

const stepsIcons = [
  "https://turonexpress.com/cdn/img/app/cabinet/index/hw-register.png",
  "https://turonexpress.com/cdn/img/app/cabinet/index/hw-shopping.png",
  "https://turonexpress.com/cdn/img/app/cabinet/index/hw-product.png",
  "https://turonexpress.com/cdn/img/app/cabinet/index/hw-give.png",
];

export default function HowItWorksSection() {
  const { t } = useTranslation();
  const steps = t("howItWorks.steps", { returnObjects: true }) as Array<{
    title: string;
    description: string;
    link?: string;
  }>;

  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-4 py-12 text-center">
      <h2 className="text-3xl font-bold mb-2">{t("howItWorks.title")}</h2>
      <p className="text-gray-600 mb-10">{t("howItWorks.subtitle")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-md p-6 text-left hover:shadow-lg transition">
            <img src={stepsIcons[index]} alt={step.title} className="w-16 h-16 mb-4 mx-auto" />
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-gray-700 mb-2">{step.description}</p>
            {step.link && (
              <a href="#" className="text-blue-600 text-sm hover:underline font-medium">
                {step.link}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
