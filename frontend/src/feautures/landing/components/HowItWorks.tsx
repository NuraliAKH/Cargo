import React from "react";

type Step = {
  title: string;
  description: string;
  link?: string;
  icon: string;
};

const steps: Step[] = [
  {
    title: "1. Регистрируйтесь",
    description: "Зарегистрируйтесь на сайте, чтобы получить персональный адрес в США. Это займет 1 минуту.",
    link: "Получить личный адрес",
    icon: "https://turonexpress.com/cdn/img/app/cabinet/index/hw-register.png",
  },
  {
    title: "2. Покупайте онлайн",
    description: "Заказывайте товары из интернет-магазинов США и укажите полученный адрес при оформлении покупки.",
    link: "Популярные магазины",
    icon: "https://turonexpress.com/cdn/img/app/cabinet/index/hw-shopping.png",
  },
  {
    title: "3. Зарегистрируйте покупку",
    description: "Зарегистрируйте покупку в личном кабинете, оплатите доставку онлайн картами Visa или Mastercard.",
    link: "Подробнее о доставке",
    icon: "https://turonexpress.com/cdn/img/app/cabinet/index/hw-product.png",
  },
  {
    title: "4. Получайте",
    description: "Доставка займет от 7 дней с момента отправки. Следите за статусом и отслеживайте посылку.",
    icon: "https://turonexpress.com/cdn/img/app/cabinet/index/hw-give.png",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-4 py-12 text-center">
      <h2 className="text-3xl font-bold mb-2">Как это работает?</h2>
      <p className="text-gray-600 mb-10">Выполните четыре простых шага, чтобы получить покупку из США</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-md p-6 text-left hover:shadow-lg transition">
            <img src={step.icon} alt={step.title} className="w-16 h-16 mb-4 mx-auto" />
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
