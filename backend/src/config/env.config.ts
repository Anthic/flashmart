import z from 'zod';

export const environmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:3000')
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    )
    .refine(
      (origins) =>
        origins.length > 0 && origins.every((origin) => URL.canParse(origin)),
      'CORS_ORIGINS must contain one or more valid URLs',
    ),

  BODY_LIMIT: z
    .string()
    .regex(/^\d+(kb|mb)$/i)
    .default('100kb'),

  DATABASE_URL: z
    .string()
    .url()
    .refine(
      (value) => value.startsWith('postgresql://'),
      'DATABASE_URL must use the postgresql:// protocol',
    ),
});

export type Environment = z.infer<typeof environmentSchema>;
