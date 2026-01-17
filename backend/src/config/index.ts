import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/gobesnet?schema=public',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  
  // MikroTik
  MIKROTIK_HOST: process.env.MIKROTIK_HOST || '192.168.88.1',
  MIKROTIK_PORT: parseInt(process.env.MIKROTIK_PORT || '8728', 10),
  MIKROTIK_USER: process.env.MIKROTIK_USER || 'admin',
  MIKROTIK_PASSWORD: process.env.MIKROTIK_PASSWORD || 'admin',
  
  // WhatsApp
  WHATSAPP_ENABLED: process.env.WHATSAPP_ENABLED === 'true',
  WHATSAPP_API_KEY: process.env.WHATSAPP_API_KEY || '',
  WHATSAPP_SENDER: process.env.WHATSAPP_SENDER || '',
  
  // Telegram
  TELEGRAM_ENABLED: process.env.TELEGRAM_ENABLED === 'true',
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || '',
  
  // App
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  API_URL: process.env.API_URL || 'http://localhost:5000',
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // Billing
  BILLING_ENABLED: process.env.BILLING_ENABLED === 'true',
  BILLING_CURRENCY: process.env.BILLING_CURRENCY || 'IDR',
  
  // Scheduler
  SCHEDULER_ENABLED: process.env.SCHEDULER_ENABLED === 'true',
};

export default config;
