# Common Expense Module Documentation

This document describes the structure and usage of the Common Expense module, including the Mongoose model, controller functions, routes, and utility functions.

---

## 1. CommonExpense Model (`models/CommonExpense.js`)

Defines the schema for a common (recurring) expense record.

**Fields:**
- `category` (String, required)
- `amount` (Number, required)
- `startDate` (Date, required)
- `duration` (Number, optional, in months)
- `isActive` (Boolean, default: true)
- `createdAt` (Date, default: now)

**Sample CommonExpense document:**
```json
{
  "category": "Rent",
  "amount": 12000,
  "startDate": "2025-07-01T00:00:00.000Z",
  "duration": 12,
  "isActive": true,
  "createdAt": "2025-07-01T12:00:00.000Z"
}
```

---

## 2. CommonExpense Controller (`controllers/commonExpenseController.js`)

Handles business logic for common expense operations.

**Functions:**
- `createCommonExpense(req, res)` — Create a new common expense and generate monthly recurring entries.
- `updateCommonExpense(req, res)` — Update a common expense by ID.
- `deleteCommonExpense(req, res)` — Delete a common expense by ID.
- `getAllCommonExpenses(req, res)` — Get all common expenses.
- `getCommonExpenseLogs(req, res)` — Get logs for a specific common expense.

---

## 3. CommonExpense Routes (`routes/commonExpenseRoutes.js`)

Defines REST API endpoints for common expenses.

| Method | Path                | Description                  | Controller Function      |
|--------|---------------------|------------------------------|-------------------------|
| GET    | `/`                 | Get all common expenses      | getAllCommonExpenses    |
| POST   | `/`                 | Create common expense        | createCommonExpense     |
| DELETE | `/:id`              | Delete common expense        | deleteCommonExpense     |
| PUT    | `/:id`              | Update common expense        | updateCommonExpense     |
| GET    | `/:id/logs`         | Get logs for common expense  | getCommonExpenseLogs    |

---

## 4. CommonExpense Utilities (`utils/commonExpenseQueries.js`)

- `getActiveCommonExpenses()` — Get all active common expenses.
- `getCommonExpensesByCategory(category)` — Get active common expenses by category.
- `getCommonExpensesByDateRange(startDate, endDate)` — Get active common expenses in a date range.
- `getCommonExpensesSummary()` — Get total and count by category.
- `getCommonExpensesByMonth(year)` — Get total and count by month for a year.
- `getCommonExpensesByYear(year)` — Get total and count by year.
- (Additional advanced queries available in utils/commonExpenseUtils.js)

---

## 5. Advanced Query Routes (`routes/commonExpenseRoutes.js`)

Provides endpoints for advanced queries and filters, e.g.:
- `/summary` — Category summary
- `/month/:year` — Month summary for a year
- `/year/:year` — Year summary
- `/daterange?start=YYYY-MM-DD&end=YYYY-MM-DD` — By start date range
- `/category/:category` — By category
- `/active` — All active common expenses

---

## 6. Notes
- All controllers and utils use async/await and return JSON.
- Input validation and authentication are recommended for production.
- Indexing on `category` and `startDate` is recommended for reporting and analytics.

---

## 7. Relationships Between Modules

```
CommonExpense → used in → Dashboard, Analytics, Recurring Expense Automation
```

---

## 🚀 Future Plans
- Advanced scheduling and automation for recurring expenses
- Smart suggestions for common expenses
- Integration with budget and analytics modules

---

For more details, see the respective files in the `server/` directory.
