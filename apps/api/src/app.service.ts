import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'hstle-api',
      timestamp: new Date().toISOString(),
    };
  }
}
