# LiteServe

A lightweight, TypeScript-based HTTP server that exposes SQLite databases via a RESTful API. Transform your file-based SQLite database into a server-accessible database with simple HTTP requests.

## Features

- 🚀 **Simple HTTP API** - Execute SQL queries via REST endpoints
- 🔒 **API Token Authentication** - Secure your database with token-based auth
- 📦 **Pure JavaScript** - Uses `sql.js` (no native dependencies)
- 🔄 **Auto-Persistence** - Automatically saves changes to disk
- ⚡ **Fast** - In-memory database with file-based persistence

## Prerequisites

- Node.js (v18 or higher)
- pnpm (or npm/yarn)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mohammed-mlh/liteserve.git
cd liteserve
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file:
```env
PORT=3005
DB_FILE=./db.sqlite
API_TOKEN=your-secret-token-here
```

## Usage

### Development

Start the development server:
```bash
pnpm dev
```

### Production

Build and start:
```bash
pnpm build
pnpm start
```

### Watch Mode

Auto-reload on file changes:
```bash
pnpm watch
```

## API Endpoints

### Health Check

```http
GET /health
```

Returns the server and database status.

**Response:**
```json
{
  "status": "ok",
  "database": "initialized"
}
```

### Execute Query

```http
POST /query
Content-Type: application/json
x-api-token: your-secret-token-here
```

Execute SQL queries against the database.

**Request Body:**
```json
{
  "sql": "SELECT * FROM users WHERE id = ?"
}
```

**Response (Read Query):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
]
```

**Response (Write Query):**
```json
{
  "success": true
}
```

## Authentication

The API uses token-based authentication. Include your API token in one of these ways:

1. **Header (Recommended):**
```http
x-api-token: your-secret-token-here
```

2. **Authorization Header:**
```http
Authorization: Bearer your-secret-token-here
```

## Example Usage

### JavaScript/TypeScript

```typescript
const response = await fetch('http://localhost:3005/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-token': 'your-secret-token-here'
  },
  body: JSON.stringify({ 
    sql: 'SELECT * FROM users' 
  })
});

const data = await response.json();
console.log(data);
```

### cURL

```bash
curl -X POST http://localhost:3005/query \
  -H "Content-Type: application/json" \
  -H "x-api-token: your-secret-token-here" \
  -d '{"sql": "SELECT * FROM users"}'
```

## Project Structure

```
liteserve/
├── src/
│   ├── index.ts           # Main server file
│   ├── db-utils.ts         # Database utility functions
│   ├── sqljs.d.ts          # TypeScript definitions for sql.js
│   └── utils/
│       ├── errors.ts       # Custom error classes
│       └── error-handler.ts # Error handling middleware
├── db.sqlite               # SQLite database file
├── package.json
├── tsconfig.json
└── README.md
```

## Error Handling

The API returns structured error responses:

**Validation Error (400):**
```json
{
  "error": "Validation Error",
  "message": "SQL query is required"
}
```

**Authentication Error (401):**
```json
{
  "error": "Authentication Error",
  "message": "Invalid or missing API token"
}
```

**Database Error (500):**
```json
{
  "error": "Database Error",
  "message": "Database query failed: ..."
}
```

## Security Considerations

⚠️ **Important Security Notes:**

- This server accepts raw SQL queries, which can be a security risk
- Always use API token authentication in production
- Consider implementing additional security measures:
  - Rate limiting
  - SQL injection prevention
  - Input validation
  - Query whitelisting for production use
- Never expose this server to the public internet without proper security measures

## Limitations

- Single database instance (not suitable for high-concurrency scenarios)
- In-memory database (limited by available RAM)
- No connection pooling
- Synchronous file I/O for persistence

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- Uses [sql.js](https://sql.js.org/) for SQLite in JavaScript
- Inspired by [Turso](https://turso.tech/) - SQLite in the cloud

