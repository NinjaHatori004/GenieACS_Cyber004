# Build stage
FROM --platform=linux/arm64 node:18-alpine AS builder

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache python3 make g++

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Runtime stage
FROM --platform=linux/arm64 node:18-alpine

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache curl

# Copy built application
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

# Create a simple healthcheck script
RUN echo '#!/usr/bin/env node\n\
const http = require("http");\n\
const options = {\n  host: "localhost",\n  port: 5000,\n  path: "/health",\n  timeout: 2000,\n  method: "GET"\n};\n\
const req = http.request(options, (res) => {\n  console.log(`STATUS: ${res.statusCode}`);\n  process.exit(res.statusCode === 200 ? 0 : 1);\n});\n\
req.on("error", (err) => {\n  console.error("Health check failed:", err);\n  process.exit(1);\n});\n\
req.end();' > healthcheck.js && chmod +x healthcheck.js

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD ["node", "healthcheck.js"]

# Start the application
CMD ["node", "dist/index.js"]
