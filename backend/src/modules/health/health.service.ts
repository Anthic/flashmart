import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma.service';

@Injectable()
export class HealthService {
  constructor (private readonly prisma: PrismaService) {}
  getLive(): { status: 'ok' } {
    return { status: 'ok' };
  }
  async getReady(): Promise<{ status: 'ok' }> {
    await this.prisma.$queryRaw`SELECT 1`;

    return { status: 'ok' };
  }
}
