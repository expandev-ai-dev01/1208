# Gerenciador de Hábitos - Backend API

Backend REST API for habit tracking system built with Node.js, Express, and TypeScript.

## Features

- RESTful API architecture
- TypeScript for type safety
- Express.js framework
- In-memory data storage
- Comprehensive validation with Zod
- CORS enabled for frontend integration
- Security middleware (Helmet)
- Request compression
- Structured logging

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

## Development

```bash
# Run in development mode with hot reload
npm run dev
```

The API will be available at `http://localhost:3000/api/v1`

## Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## API Documentation

### Base URL

- Development: `http://localhost:3000/api/v1`
- Production: `https://api.yourdomain.com/api/v1`

### Health Check

```
GET /health
```

Returns server health status.

### API Endpoints

API endpoints will be documented as features are implemented.

## Project Structure

```
src/
├── api/              # API controllers
│   └── v1/           # API version 1
│       ├── external/ # Public endpoints
│       └── internal/ # Authenticated endpoints
├── routes/           # Route definitions
├── middleware/       # Express middleware
├── services/         # Business logic
├── utils/            # Utility functions
├── constants/        # Application constants
├── instances/        # Service instances
├── tests/            # Global test utilities
└── server.ts         # Application entry point
```

## Environment Variables

See `.env.example` for all available configuration options.

## License

ISC