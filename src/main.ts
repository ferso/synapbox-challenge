import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorsInterceptor } from './shared/interceptors/errors.interceptors';
const dotenv = require('dotenv');
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  app.setGlobalPrefix('/api');
  app.useGlobalInterceptors(new ErrorsInterceptor());
  await app.listen(process.env.APP_PORT);
}
bootstrap();
