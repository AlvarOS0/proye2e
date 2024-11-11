import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  calcular(): string {
    return 'se esta realizando una operacion';
  }

}
