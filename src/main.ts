import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTOで定義されていないプロパティを自動で除去
      forbidNonWhitelisted: true, // 想定外のプロパティがあればエラーを投げる
      transform: true, // リクエストデータを自動的にDTOクラスのインスタンスに変換
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
