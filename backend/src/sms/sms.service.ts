import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private token: string | null = null;
  private readonly baseUrl = "https://notify.eskiz.uz/api";

  constructor() {
    this.login(); // Авто-логин при старте
  }

  private async login() {
    try {
      const { data } = await axios.post(`${this.baseUrl}/auth/login`, {
        email: process.env.ESKIZ_EMAIL,
        password: process.env.ESKIZ_PASSWORD,
      });
      this.token = data.data.token;
      this.logger.log("✅ Eskiz SMS: успешно авторизован");
    } catch (e: any) {
      this.logger.error("❌ Eskiz SMS: ошибка авторизации", e?.response?.data || e);
    }
  }

  async sendSms(phone: string, message: string) {
    if (!this.token) {
      this.logger.warn("Токен отсутствует, выполняется повторный вход...");
      await this.login();
    }

    try {
      await axios.post(
        `${this.baseUrl}/message/sms/send`,
        {
          mobile_phone: phone.replace(/\D/g, ""), // очищаем от пробелов и +998
          message,
          from: "4546", // твой короткий номер от Eskiz (замени, если другой)
          callback_url: "", // опционально
        },
        {
          headers: { Authorization: `Bearer ${this.token}` },
        }
      );
      this.logger.log(`📩 SMS отправлено: ${phone}`);
    } catch (e: any) {
      this.logger.error(`❌ Ошибка отправки SMS (${phone})`, e?.response?.data || e);
    }
  }
}
