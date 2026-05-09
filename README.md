# hcmus-cart-mgmt

Seminar project (food delivery) demonstrating 4 NoSQL databases:

- **MongoDB**: main transactional documents (orders, restaurants, menu, customers)
- **Redis**: cache + ephemeral state (cart cache, sessions, rate limit, leaderboards)
- **Cassandra**: high-write / time-series log (order events, delivery tracking)
- **Neo4j**: graph relationships (recommendations, affinities, routing graph demo)

## Structure

```text
.
├─ src/
│  ├─ server.js                # Express bootstrap
│  ├─ config/env.js            # env loader/validation
│  ├─ db/                      # DB clients (Mongo/Redis/Cassandra/Neo4j)
│  ├─ routes/                  # API route mounting
│  └─ modules/                 # feature modules (domain logic)
│     └─ orders/               # sample module wired to all 4 DBs
├─ scripts/                    # seed scripts (placeholders)
├─ docker-compose.yml          # local DBs
└─ .env.example                # env template
```

## Run locally

1. Start databases:

```bash
docker compose up -d
```

2. Create `.env` from `.env.example` (adjust if needed).

3. Run API:

```bash
npm run dev
```

API:

- `GET /api/health`
- `GET /api/orders`
- `POST /api/orders`

Example payload for `POST /api/orders`:

```json
{
  "customerId": "c1",
  "restaurantId": "r1",
  "items": [{ "itemId": "m1", "name": "Pho", "qty": 1, "price": 50000 }],
  "total": 50000
}
```
