# Rate Limiter

A small Express + TypeScript API that demonstrates Redis-backed sliding window log rate limiting.

## What it does

- Uses Redis sorted sets to store request timestamps per IP address.
- Applies a global sliding window log limiter to all routes.
- Applies a stricter sliding window log limiter to `/api/data`.
- Returns `429 Too Many Requests` when a client exceeds the configured limit.

## Tech Stack

- Express 5
- TypeScript
- Redis via `ioredis`
- `dotenv` for environment loading

## Prerequisites

- Node.js 18+ recommended
- Redis running locally on `127.0.0.1:6379`

## Installation

```bash
npm install
```

## Running the Project

Build and start the app:

```bash
npm run dev
```

The server starts on `http://localhost:3000`.

## Available Routes

- `GET /` - Returns a success message.
- `GET /api/data` - Returns sample data and uses the stricter rate limiter.

## Rate Limits

The current limits are defined in [`src/index.ts`](src/index.ts):

- Global sliding window log limiter: 10 requests per 60 seconds
- Strict sliding window log limiter: 3 requests per 60 seconds

## How It Works

Each request is recorded in Redis with a timestamp. Before allowing a request, the middleware removes timestamps that are older than the configured window, counts the remaining entries, and decides whether the request should pass. This gives a true sliding window view instead of resetting all counters at a fixed interval.

## Response Headers

The middleware sets standard rate-limit headers on each request:

- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`
- `Retry-After`

## Project Structure

```text
src/
  index.ts
  middleware/
    rateLimiter.ts
  redis/
    client.ts
```

## Notes

- Redis is currently configured directly in [`src/redis/client.ts`](src/redis/client.ts) to use `127.0.0.1:6379`.
- The middleware normalizes the localhost IPv6 loopback address (`::1`) to `127.0.0.1`.
- Requests from whitelisted IPs are skipped by the rate limiter.
