import { PrismaService } from '../../infra/database/prisma.service';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;

  const prisma = {
    $queryRaw: jest.fn(),
  } as unknown as PrismaService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new HealthService(prisma);
  });

  it('reports that the process is live', () => {
    expect(service.getLive()).toEqual({ status: 'ok' });
  });

  it('reports ready when PostgreSQL responds', async () => {
    jest.mocked(prisma.$queryRaw).mockResolvedValue([]);

    await expect(service.getReady()).resolves.toEqual({ status: 'ok' });
    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
  });
});