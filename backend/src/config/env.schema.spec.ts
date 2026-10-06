import { environmentSchema } from './env.config';

describe('environmentSchema', () => {
  it('uses secure local defaults', () => {
    const config = environmentSchema.parse({});

    expect(config.NODE_ENV).toBe('development');
    expect(config.PORT).toBe(3000);
    expect(config.CORS_ORIGINS).toEqual(['http://localhost:3000']);
    expect(config.BODY_LIMIT).toBe('100kb');
  });

  it('rejects an invalid port', () => {
    expect(() => environmentSchema.parse({ PORT: '70000' })).toThrow();
  });

  it('rejects an invalid CORS origin', () => {
    expect(() =>
      environmentSchema.parse({ CORS_ORIGINS: 'not-a-url' }),
    ).toThrow();
  });
});
