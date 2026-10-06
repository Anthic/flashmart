import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(() => {
    service = new HealthService();
  });

  it('reports that the process is live', () => {
    expect(service.getLive()).toEqual({ status: 'ok' });
  });
});
