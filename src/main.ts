import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidacionPipe } from './common/validacion.pipe';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //configuracion con swagger
  const config = new DocumentBuilder()
  .setTitle('Documentación del Proyecto')
  .setDescription('Documentación para acceder a todos los APIs del proyecto, y gestionar la tienda de productos')
  .setVersion('1.0')
  .build();

  const documentacion = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentacion)

  app.useGlobalPipes(new ValidacionPipe());
  await app.listen(3000);
}
bootstrap();
