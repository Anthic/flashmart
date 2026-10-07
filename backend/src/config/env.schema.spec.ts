import { environmentSchema } from './env.config';

const validDatabaseUrl =
  'postgresql://flashmart:password@localhost:5432/flashmart?schema=public';

describe('environmentSchema', () => {
  it('uses secure local defaults', () => {
    const config = environmentSchema.parse({
      DATABASE_URL: validDatabaseUrl,
    });

    expect(config.NODE_ENV).toBe('development');
    expect(config.PORT).toBe(3000);
    expect(config.CORS_ORIGINS).toEqual(['http://localhost:3000']);
    expect(config.BODY_LIMIT).toBe('100kb');
    expect(config.DATABASE_URL).toBe(validDatabaseUrl);
  });

  it('rejects an invalid port', () => {
    expect(() =>
      environmentSchema.parse({
        DATABASE_URL: validDatabaseUrl,
        PORT: '70000',
      }),
    ).toThrow();
  });

  it('rejects an invalid CORS origin', () => {
    expect(() =>
      environmentSchema.parse({
        DATABASE_URL: validDatabaseUrl,
        CORS_ORIGINS: 'not-a-url',
      }),
    ).toThrow();
  });

  it('rejects a missing database URL', () => {
    expect(() => environmentSchema.parse({})).toThrow();
  });
});
