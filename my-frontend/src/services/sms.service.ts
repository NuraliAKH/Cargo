// sms.service.ts
import axios from "axios";

const ESKIZ_EMAIL = process.env.ESKIZ_EMAIL!;
const ESKIZ_PASSWORD = process.env.ESKIZ_PASSWORD!;
let TOKEN: string | null = null;

async function getToken() {
  if (TOKEN) return TOKEN;
  const { data } = await axios.post("https://notify.eskiz.uz/api/auth/login", {
    email: ESKIZ_EMAIL,
    password: ESKIZ_PASSWORD,
  });
  TOKEN = data.data.token;
  return TOKEN;
}

export async function sendSMS(phone: string, text: string) {
  const token = await getToken();
  const { data } = await axios.post(
    "https://notify.eskiz.uz/api/message/sms/send",
    {
      mobile_phone: phone.replace(/\D/g, ""), // Убираем + и пробелы
      message: text,
      from: "4546", // обычно 4546 — дефолтный отправитель
      callback_url: "https://yourdomain.uz/sms/callback",
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}
