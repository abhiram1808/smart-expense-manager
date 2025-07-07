# Budget Module Documentation

This document describes the structure and usage of the Budget module, including the Mongoose model, controller functions, routes, and utility functions.

---

## 1. Budget Model (`models/Budget.js`)

Defines the schema for a budget record.

**Fields:**
- `category` (String, required)
- `budgetAmount` (Number, required)
- `month` (String, required, format: e.g. "Jul 2025")
- `createdAt` (Date, default: now)

**Sample Budget document:**
```json
{
  "category": "Groceries",
  "budgetAmount": 8000,
  "month": "Jul 2025",
  "createdAt": "2025-07-01T12:00:00.000Z"
}
```

**Indexing for Performance:**
```js
// In your Budget schema definition
budgetSchema.index({ month: 1 });
budgetSchema.index({ category: 1 });
```

---

## 2. Budget Controller (`controllers/budgetController.js`)

Handles business logic for budget operations.

**Functions:**
- `createBudget(req, res)` — Create a new budget record.
- `getBudgets(req, res)` — Get all budget records.

---

## 3. Budget Routes (`routes/budgetRoutes.js`)

Defines REST API endpoints for budgets.

| Method | Path         | Description         | Controller Function |
|--------|--------------|--------------------|--------------------|
| POST   | `/`          | Create budget      | createBudget       |
| GET    | `/`          | Get all budgets    | getBudgets         |

**Sample Request:**
```bash
# Create Budget (POST)
curl -X POST http://localhost:5000/api/budget \
  -H "Content-Type: application/json" \
  -d '{"category":"Groceries","budgetAmount":8000,"month":"Jul 2025"}'
```

---

## 4. Budget Utilities (`utils/budgetQueries.js`)

- `getBudgets(filters)` — Get all budgets, optionally filtered by month, category, min/max amount.
- `getBudgetSummaryByCategory()` — Get total and count by category.
- `getBudgetSummaryByMonth()` — Get total and count by month.
- `getBudgetByDateRange(start, end)` — Get budgets created in a date range.
- `getBudgetByCategoryAndMonth(category, month)` — Get budgets by category and month.
- `getBudgetByAmountRangeAndMonth(min, max, month)` — Get budgets by amount range and month.

---

## 5. Advanced Query Routes (`routes/budgetRoutes.js`)

Provides endpoints for advanced queries and filters, e.g.:
- `/summary/category` — Category summary
- `/summary/month` — Month summary
- `/daterange?start=YYYY-MM-DD&end=YYYY-MM-DD` — By created date range
- `/category-month?category=...&month=...` — By category and month
- `/amount-month?min=MIN&max=MAX&month=...` — By amount range and month

---

## 6. Notes
- All controllers and utils use async/await and return JSON.
- Input validation and authentication are recommended for production.
- Indexing on `month` and `category` is recommended for reporting and analytics.

---

## 7. Relationships Between Modules

```
Budget → used in → Dashboard, Analytics
```

---

## 🚀 Future Plans
- Budget forecasting and smart suggestions
- AI-based budget recommendations
- Integration with expense analytics

---

For more details, see the respective files in the `server/` directory.
