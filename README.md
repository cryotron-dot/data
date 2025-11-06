# Riot API Server

Express.js backend API for serving JSON data and executing commands.

## Features

- ✅ Serve JSON data from files
- ✅ Update JSON data via POST requests
- ✅ Execute system commands (with security warnings)
- ✅ CORS enabled
- ✅ Error handling
- ✅ Health check endpoint

## Installation

```bash
npm install
```

## Usage

### Development (with auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on `http://localhost:3000` (or the PORT specified in `.env`).

## API Endpoints

### Health Check
```bash
GET /api/health
```

Returns server status and uptime.

### Get JSON Data
```bash
GET /api/data
GET /api/data2
```

Returns the contents of `riot-output.json` or `riot-output-2.json`.

**Example:**
```bash
curl http://localhost:3000/api/data
```

### Update JSON Data
```bash
POST /api/data
POST /api/data2
Content-Type: application/json
```

Updates the JSON file with the provided data.

**Example:**
```bash
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

### Execute Command
```bash
POST /api/command
Content-Type: application/json

{
  "command": "ls -la",
  "timeout": 30000
}
```

Executes a system command and returns the output.

**⚠️ WARNING:** This endpoint executes arbitrary commands and should only be used in a controlled environment. Do not expose this to the internet without proper authentication and authorization.

**Example:**
```bash
curl -X POST http://localhost:3000/api/command \
  -H "Content-Type: application/json" \
  -d '{"command": "echo Hello World"}'
```

### List Files
```bash
GET /api/files
```

Returns a list of all JSON files in the directory.

**Example:**
```bash
curl http://localhost:3000/api/files
```

## Security Considerations

⚠️ **IMPORTANT:** The `/api/command` endpoint allows execution of arbitrary system commands. This is a significant security risk:

- Only use in development or controlled environments
- Never expose to the internet without authentication
- Consider implementing:
  - Authentication (JWT, API keys, etc.)
  - Command whitelist
  - Rate limiting
  - Input validation and sanitization

## Environment Variables

Create a `.env` file (copy from `.env.example`):

```
PORT=3000
```

## Response Format

All responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## License

ISC
