# Income Module Documentation

This document describes the structure and usage of the Income module, including the Mongoose model, controller functions, routes, and utility functions.

---

## 1. Income Model (`models/Income.js`)

Defines the schema for an income record.

**Fields:**
- `amount` (Number, required)
- `source` (String, required)
- `month` (String, required, format: YYYY-MM)
- `createdAt` (Date, default: now)

**Sample Income document:**
```json
{
  "amount": 50000,
  "source": "Salary",
  "month": "2025-07",
  "createdAt": "2025-07-01T12:00:00.000Z"
}
```

**Indexing for Performance:**
```js
// In your Income schema definition
incomeSchema.index({ month: 1 });
incomeSchema.index({ source: 1 });
```

---

## 2. Income Controller (`controllers/incomeController.js`)

Handles business logic for income operations.

**Functions:**
- `getAllIncome(req, res)` — Get all income records, sorted by createdAt descending.
- `createIncome(req, res)` — Create a new income record.
- `deleteIncome(req, res)` — Delete an income record by ID.
- `updateIncome(req, res)` — Update an income record by ID.

---

## 3. Income Routes (`routes/incomeRoutes.js`)

Defines REST API endpoints for income.

| Method | Path         | Description         | Controller Function |
|--------|--------------|--------------------|--------------------|
| GET    | `/`          | Get all income     | getAllIncome       |
| POST   | `/`          | Create income      | createIncome       |
| DELETE | `/:id`       | Delete income      | deleteIncome       |
| PUT    | `/:id`       | Update income      | updateIncome       |

**Sample Request:**
```bash
# Create Income (POST)
curl -X POST http://localhost:5000/api/income \
  -H "Content-Type: application/json" \
  -d '{"amount":50000,"source":"Salary","month":"2025-07"}'
```

---

## 4. Income Utilities (`utils/incomeQueries.js`)

- `getIncome(filters)` — Get all income, optionally filtered by month, source, min/max amount.
- `getIncomeSummaryBySource()` — Get total and count by source.
- `getIncomeSummaryByMonth()` — Get total and count by month.
- `getIncomeByDateRange(start, end)` — Get income created in a date range.
- `getIncomeBySourceAndMonth(source, month)` — Get income by source and month.
- `getIncomeByAmountRangeAndMonth(min, max, month)` — Get income by amount range and month.

---

## 5. Advanced Query Routes (`routes/incomeRoutes.js`)

Provides endpoints for advanced queries and filters, e.g.:
- `/summary/source` — Source summary
- `/summary/month` — Month summary
- `/daterange?start=YYYY-MM-DD&end=YYYY-MM-DD` — By created date range
- `/source-month?source=...&month=...` — By source and month
- `/amount-month?min=MIN&max=MAX&month=...` — By amount range and month

---

## 6. Notes
- All controllers and utils use async/await and return JSON.
- Input validation and authentication are recommended for production.
- Indexing on `month` and `source` is recommended for reporting and analytics.

---

## 7. Relationships Between Modules

```
Income → used in → Dashboard, Analytics
```

---

## 🚀 Future Plans
- Income forecasting and smart suggestions
- AI-based income categorization and anomaly detection
- Integration with budget and expense analytics

---

For more details, see the respective files in the `server/` directory.
