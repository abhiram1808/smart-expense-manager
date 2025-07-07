# Expense Module Documentation

This document describes the structure and usage of the Expense module, including the Mongoose model, controller functions, routes, and utility functions.

---

## 1. Expense Model (`models/Expense.js`)

Defines the schema for an expense record.

**Fields:**
- `category` (String, required)
- `amount` (Number, required)
- `date` (Date, required)
- `isRecurring` (Boolean, default: false)
- `year` (Number)
- `month` (Number)
- `createdAt` (Date, default: now)
- `commonExpenseId` (ObjectId, ref: 'CommonExpense', optional)

**Sample Expense document:**
```json
{
  "category": "Rent",
  "amount": 12000,
  "date": "2025-07-01T00:00:00.000Z",
  "isRecurring": true,
  "year": 2025,
  "month": 7,
  "createdAt": "2025-07-01T12:00:00.000Z",
  "commonExpenseId": "60f7c2b8e1b2c8a1d4e8b123"
}
```

**Indexing for Performance:**
```js
// In your Expense schema definition
expenseSchema.index({ date: 1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ commonExpenseId: 1 });
```

---

## 2. Expense Controller (`controllers/expenseController.js`)

Handles business logic for expense operations.

**Functions:**
- `createExpense(req, res)` — Create a new expense from request body.
- `getExpenses(req, res)` — Get all expenses, sorted by date descending.

**Usage of Utilities:**
- `generateMonthlyExpenses()` is used in `createCommonExpense()` to auto-insert recurring entries into the Expense collection.

---

## 3. Expense Routes (`routes/expenseRoutes.js`)

Defines REST API endpoints for expenses.

| Method | Path         | Description         | Controller Function |
|--------|--------------|--------------------|--------------------|
| POST   | `/`          | Create expense     | createExpense      |
| GET    | `/`          | Get all expenses   | getExpenses        |

**Sample Request:**
```bash
# Create Expense (POST)
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"category":"Groceries","amount":2000,"date":"2025-07-02"}'
```

---

## 4. Expense Utilities (`utils/`)

### Common Expense Utilities
- `commonExpenseGenerators.js` — Functions to generate recurring expenses.
- `commonExpenseLogs.js` — Functions to log changes to common expenses.
- `commonExpenseQueries.js` — Query and aggregation helpers for common expenses.
- `commonExpenseFilters.js` — Advanced filter helpers for common expenses.

**Example Utility Function Annotation:**
```js
// utils/commonExpenseGenerators.js
/**
 * generateMonthlyExpenses(commonExpense)
 * - Auto-creates monthly recurring Expense documents
 * - Used in: createCommonExpense controller, autoInsertCommonExpenses CRON
 */
```

### Example Utility Functions
- `generateMonthlyExpenses(commonExpense)` — Generate monthly recurring entries for a common expense.
- `getActiveCommonExpenses()` — Get all active common expenses.
- `getCommonExpensesByCategory(category)` — Get active common expenses by category.
- `getCommonExpensesByDateRange(start, end)` — Get active common expenses in a date range.
- `getCommonExpensesSummary()` — Get summary (total, count) by category.
- ...and more (see utils files for full list).

---

## 5. Advanced Query Routes (`routes/commonExpenseRoutes.js`)

Provides endpoints for advanced queries and filters, e.g.:
- `/active` — All active common expenses
- `/category/:category` — By category
- `/daterange?start=YYYY-MM-DD&end=YYYY-MM-DD` — By date range
- `/summary` — Category summary
- `/month/:year` — By month for a year
- `/year/:year` — By year
- `/duration/:duration` — By duration
- `/amountrange?min=MIN&max=MAX` — By amount range
- ...and more (see route file)

---

## 6. Notes
- All controllers and utils use async/await and return JSON.
- Input validation and authentication are recommended for production.
- Utilities are split for maintainability and can be imported as needed.

---

## 7. Relationships Between Modules

```
CommonExpense → creates → Expense (monthly)
CommonExpense → logs → CommonExpenseLog
Expense → belongsTo → CommonExpense (optional)
```

---

## 🚀 Future Plans
- AI prediction for dynamic expenses (like Electricity, Fuel)
- Smart update suggestions based on historical trends
- Expense auto-categorization (via NLP)
- Forecasting future budget gaps

---

For more details, see the respective files in the `server/` directory.
