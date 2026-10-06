import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getLive(): { status: 'ok' } {
    return { status: 'ok' };
  }
}
