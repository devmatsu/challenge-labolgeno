<p align="center"><a href="" target="_blank"><img src="./labolgeno-logo.png" width="400" alt="Labolgeno Logo" style="display: block; margin: 0 auto;"></a></p>

<p align="center">
<a href=""><img src="https://img.shields.io/badge/node.js-339933?style=flat&logo=Node.js&logoColor=white" alt="Node.js"></a>
<a href=""><img src="https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white" alt="Express.js"></a>
<a href=""><img src="https://img.shields.io/badge/Jest-323330?style=flat&logo=Jest&logoColor=white" alt="JEST"></a>
<a href=""><img src="https://img.shields.io/badge/SQLite-07405E?style=flat&logo=sqlite&logoColor=white" alt="SQLite"></a>
<a href=""><img src="https://img.shields.io/badge/production readiness-⚠️ partial-orange" alt="Production Readiness"></a>
<a href=""><img src="https://img.shields.io/badge/version-1.0.0-green" alt="Version"></a>
</p>

# About

This repository contains the solution to a backend challenge focused on building a RESTful API using Node.js and TypeScript. The application supports full CRUD operations for managing devices, with business rules that prevent certain updates or deletions when a device is in use.

The project includes:

- ✅ Full CRUD support
- ✅ Domain validations and business rules
- ✅ Type-safe codebase using TypeScript 5+
- ✅ Global error handling middleware
- ✅ Unit and integration testing with Jest
- ✅ Docker support for containerized deployment
- ✅ Prisma ORM with SQLite (easily swappable for PostgreSQL or MySQL)

The tech stack used includes:

- Node.js + TypeScript
- Express.js for routing
- Prisma ORM
- SQLite as the database
- Jest for testing

You can find the full challenge description [here](./CHALLENGE.md).

---

# 1. Installation and Running

### Prerequisites

- **Node.js** (LTS version recommended, [install here](https://nodejs.org))
- **Docker** ([download](https://www.docker.com)).

### 🧱 Requirements

- Node.js `>=18`
- Docker
- npm

### 🔧 Local Setup

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

### Run with Docker

```bash
docker build -t devices-api .
docker run -p 3000:3000 devices-api
```

⚠️ **Important:** Data will not persist across container restarts unless you mount a volume for the database file.

ℹ️ To persist data, run Docker with:  
`-v $(pwd)/data:/app/prisma`

### Run Tests

```
npm test
```

# 2. API Endpoints & Usage

| Method | Route              | Description                    |
| ------ | ------------------ | ------------------------------ |
| POST   | `/api/devices`     | Create a new device            |
| GET    | `/api/devices`     | Get all devices (with filters) |
| GET    | `/api/devices/:id` | Get a specific device by ID    |
| PUT    | `/api/devices/:id` | Full update of a device        |
| PATCH  | `/api/devices/:id` | Partial update of a device     |
| DELETE | `/api/devices/:id` | Delete a device                |

### 🔹 GET /devices

Fetch all devices. Supports optional filtering by brand and state.

**Query Parameters (optional):**

- `brand` (string): Filter by brand.
- `state` (string): Filter by device state (`available`, `in-use`, `inactive`)

**Response:**

```json
{
  "message": "Devices retrieved successfully",
  "data": [
    /* Array of devices */
  ]
}
```

---

### 🔹 GET /devices/:id

Fetch a single device by its ID.

**Response:**

```json
{
  "message": "Device retrieved successfully",
  "data": {
    "id": "string",
    "name": "string",
    "brand": "string",
    "state": "available | in-use | inactive",
    "creationTime": "2025-06-15T21:32:26.589Z"
  }
}
```

---

### 🔸 POST /devices

Create a new device.

**Request Body:**
`state` is an optional field and defaults to "available" if not provided.

```json
{
  "name": "Galaxy S24",
  "brand": "Samsung",
  "state": "available"
}
```

**Response:**

```json
{
  "message": "Device created successfully",
  "data": {
    "id": "string",
    "name": "Galaxy S24",
    "brand": "Samsung",
    "state": "available",
    "creationTime": "2025-06-15T21:48:26.589Z"
  }
}
```

---

### 🔸 PUT /devices/:id

Fully update a device. Requires all fields.

**Rules:**

- Cannot update `name` or `brand` if device is in `in-use` state.

**Request Body:**

```json
{
  "name": "Galaxy S24 Ultra",
  "brand": "Samsung",
  "state": "in-use"
}
```

**Response:**

```json
{
  "message": "Device updated successfully",
  "data": {
    "id": "string",
    "name": "Galaxy S24 Ultra",
    "brand": "Samsung",
    "state": "in-use",
    "creationTime": "2025-06-15T21:28:26.589Z"
  }
}
```

---

### 🔸 PATCH /devices/:id

Partially update a device.

**Rules:**

- Cannot update `name` or `brand` if device is in `in-use` state.

**Request Body (any subset of fields):**

```json
{
  "brand": "Apple"
}
```

**Response:**

```json
{
  "message": "Device updated successfully",
  "data": {
    /* Updated device object */
  }
}
```

---

### ❌ DELETE /devices/:id

Delete a device by its ID.

**Rules:**

- Cannot delete a device if it is in `in-use` state.

**Response:**

- `204 No Content` on success
- `400 Bad Request` if the device is in use
- `404 Not Found` if the device doesn’t exist

---

# 3. Optional Improvements & Limitations

### 💡 Possible Improvements

- **Add authentication and rate limiting** – implement JWT-based auth and apply `express-rate-limit`
- **CI/CD pipeline** – automate tests, linting, and deployments (e.g., GitHub Actions)
- **Pagination & sorting for GET /devices** – support `limit`, `offset`, `sortBy`, `order`
- **Healthcheck & metrics endpoint** – add `/health` and Prometheus-compatible metrics
- **Switch to production-grade DB** – migrate to PostgreSQL or MongoDB for durability
- **Structured logging** – integrate `winston` or `pino` with log levels and transports
- **API versioning** – expose endpoints under `/api/v1/...`
- **Caching layer** – use Redis to cache frequent reads
- **Retry mechanism on DB errors** – wrap critical DB ops with retries/circuit breaker

### ⚠️ Known Limitations

- Data is not persisted across container restarts **when using Docker**, unless a Docker volume is mounted for `/app/prisma/dev.db`.
- No authentication — all routes are public
- API not versioned (e.g. `/v1/devices`)
- No retry mechanism or fallback strategy implemented for transient database failures
- No caching mechanism (e.g., Redis)
- Database queries (e.g., list all devices) **fetch all records** without pagination — this can lead to **performance degradation** with large datasets
