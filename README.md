# Gobes.net – GuiniEACS+

A comprehensive network management system for MikroTik routers with PPPoE management, billing, and monitoring.

## Features

- 🔐 JWT Authentication & RBAC
- 🌐 Real-time monitoring
- 📡 MikroTik RouterOS API integration
- 💳 Billing & auto-isolation system
- 📱 WhatsApp & Telegram notifications
- 📊 Dashboard with live statistics

## Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for development)
- pnpm (recommended)

## Quick Start

1. Clone the repository
2. Copy `.env.example` to `.env` and configure
3. Run `docker-compose up -d`
4. Access the web interface at `http://localhost:3000`

Default admin credentials:
- Username: admin
- Password: admin

## Project Structure

```
.
├── backend/           # Backend services
├── frontend/          # React frontend
├── docker-compose.yml # Production stack
└── README.md          # This file
```

## Development

### Backend

```bash
cd backend
cp .env.example .env
pnpm install
pnpm dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
pnpm install
pnpm dev
```

## License

MIT
