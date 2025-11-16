import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as crypto from "crypto";
async function bootstrap() {
  if (!(global as any).crypto) {
    (global as any).crypto = crypto;
  }
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: "*" });
  app.setGlobalPrefix("api");
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
