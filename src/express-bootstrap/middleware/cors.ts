import { IncomingMessage, ServerResponse } from 'http';
import cors from 'cors';
import * as configurationProvider from '../config-provider';
import { z } from 'zod';

const optionsSchema = z.object({
  maxAge: z.number(),
  optionsSuccessStatus: z.number(),
  origin: z.array(z.instanceof(RegExp)),
  methods: z.string(),
  allowedHeaders: z.array(z.string()),
  credentials: z.boolean().optional(),
});

const defaultOptionSchema = optionsSchema.partial({ origin: true });

type Options = z.infer<typeof defaultOptionSchema>;

export function corsSetup() {
  const options: Options = {
    maxAge: 86400,
    optionsSuccessStatus: 204,
    methods: 'GET,PUT,POST,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  const orginRegex = configurationProvider.getValue('cors.origin');

  if (orginRegex) {
    const regex =
      typeof orginRegex.regex === 'string'
        ? [orginRegex.regex]
        : orginRegex.regex;

    options.origin = regex.map((_) => new RegExp(_, 'i'));
  }

  optionsSchema.parse(options);
  return cors(options);
}
