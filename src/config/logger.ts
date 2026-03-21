import winston from 'winston';
import { env } from './env';
import type { StreamOptions } from 'morgan';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const level = (): string => {
  return env.NODE_ENV === 'development' ? 'debug' : 'info';
};

const devFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level: lvl, message }) => {
    return `${timestamp as string} [${lvl}]: ${message as string}`;
  }),
);

const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

export const logger = winston.createLogger({
  level: level(),
  levels,
  format: env.NODE_ENV === 'development' ? devFormat : prodFormat,
  transports: [new winston.transports.Console()],
});

export const morganStream: StreamOptions = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};
