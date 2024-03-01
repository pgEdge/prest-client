import * as dotenv from 'dotenv';
dotenv.config();

export default {
  BASE_URL: process.env['BASE_URL'] ?? '',
  USER_NAME: process.env['USER_NAME'] ?? '',
  USER_PASSWORD: process.env['USER_PASSWORD'] ?? '',
  DATABASE_NAME: process.env['DATABASE_NAME'] ?? '',
};
