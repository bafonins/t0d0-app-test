import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { generateSchema } from './codegen';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get('CLIENT_URI'),
  });

  const isProd = configService.get<string>('NODE_ENV') === 'production';
  const schemaFile = configService.get<string>(
    'GQL_CODEGEN_SCHEMA',
    'schema-generated.gql',
  );

  if (isProd) {
    await generateSchema(schemaFile);
  }

  await app.listen(3000);
}
bootstrap();
