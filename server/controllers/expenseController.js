// server/controllers/expenseController.js
import Expense from '../models/Expense.js';
import Category from '../models/Category.js';
import dotenv from 'dotenv'; // <--- NEW: Import dotenv
dotenv.config(); // <--- NEW: Load environment variables

// Helper function to extract and apply filters/sort
const applyFiltersAndSort = (query, reqQuery) => {
  const filter = {};
  const sort = {};

  // Date range filters
  if (reqQuery.startDate) {
    filter.date = { ...filter.date, $gte: new Date(reqQuery.startDate) };
  }
  if (reqQuery.endDate) {
    filter.date = { ...filter.date, $lte: new Date(reqQuery.endDate) };
  }

  // Specific month and year filters
  if (reqQuery.month) {
    filter.month = parseInt(reqQuery.month);
  }
  if (reqQuery.year) {
    filter.year = parseInt(reqQuery.year);
  }

  // Category filter
  if (reqQuery.category) {
    filter.category = reqQuery.category;
  }

  // Sorting
  if (reqQuery.sortBy) {
    const sortOrder = reqQuery.sortOrder === 'asc' ? 1 : -1;
    sort[reqQuery.sortBy] = sortOrder;
  } else {
    // Default sort by date descending
    sort.date = -1;
  }

  console.log('Backend: Final Mongoose query object:', filter);
  console.log('Backend: Final Mongoose sort options:', sort);

  return { filter, sort };
};

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Public
export const createExpense = async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;
    const newExpense = new Expense({
      description,
      amount,
      category,
      date,
      month: new Date(date).getMonth() + 1,
      year: new Date(date).getFullYear(),
      // user: req.user.id, // Uncomment if using authentication
    });
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Get all expenses with filtering, sorting, and pagination
// @route   GET /api/expenses
// @access  Public
export const getExpenses = async (req, res) => {
  try {
    console.log('ExpenseController: getExpenses - Request Query:', req.query);
    const { filter, sort } = applyFiltersAndSort({}, req.query);

    const page = parseInt(req.query.page) || 1; // Current page, default 1
    const limit = parseInt(req.query.limit) || 10; // Items per page, default 10
    const skip = (page - 1) * limit; // Number of documents to skip

    const expenses = await Expense.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalCount = await Expense.countDocuments(filter); // Get total count for pagination
    const totalPages = Math.ceil(totalCount / limit);

    console.log('ExpenseController: Fetched expenses count:', expenses.length);
    console.log(`ExpenseController: Total matching expenses: ${totalCount}, Total pages: ${totalPages}`);

    res.status(200).json({
      expenses,
      totalCount,
      totalPages,
      currentPage: page,
      limit,
    });
  } catch (err) {
    console.error('ExpenseController: getExpenses - Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Public
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, category, date } = req.body;
    const updatedFields = {
      description,
      amount,
      category,
      date,
      month: new Date(date).getMonth() + 1,
      year: new Date(date).getFullYear(),
    };
    const updatedExpense = await Expense.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!updatedExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.status(200).json(updatedExpense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Public
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExpense = await Expense.findByIdAndDelete(id);
    if (!deletedExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get expense summary by category
// @route   GET /api/expenses/summary/category
// @access  Public
export const getExpenseSummaryByCategory = async (req, res) => {
  try {
    const { year, month } = req.query;
    const match = {};
    if (year) match.year = parseInt(year);
    if (month) match.month = parseInt(month);

    const summary = await Expense.aggregate([
      { $match: match },
      { $group: { _id: '$category', totalAmount: { $sum: '$amount' } } },
      { $sort: { totalAmount: -1 } },
    ]);
    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get monthly expense summary for a given year
// @route   GET /api/expenses/summary/monthly
// @access  Public
export const getMonthlyExpenseSummary = async (req, res) => {
  try {
    const year = parseInt(req.query.year);
    if (isNaN(year)) {
      return res.status(400).json({ error: 'Year query parameter is required and must be a number.' });
    }
    const summary = await Expense.aggregate([
      { $match: { year: year } },
      { $group: { _id: '$month', totalAmount: { $sum: '$amount' } } },
      { $sort: { _id: 1 } },
    ]);
    res.status(200).json(summary);
  } catch (err) {
    console.error('Backend: getMonthlyExpenseSummary - Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get yearly expense summary
// @route   GET /api/expenses/summary/yearly
// @access  Public
export const getYearlyExpenseSummary = async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      { $group: { _id: '$year', totalAmount: { $sum: '$amount' } } },
      { $sort: { _id: 1 } },
    ]);
    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get AI-powered spending insights
// @route   GET /api/expenses/insights
// @access  Public
export const getSpendingInsights = async (req, res) => {
  try {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // Fetch expenses for the current month
    const currentMonthExpenses = await Expense.find({
      month: currentMonth,
      year: currentYear,
    });

    // Fetch expenses for the past 3 months (for average calculation)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    threeMonthsAgo.setDate(1); // Start from the beginning of the month 3 months ago

    const historicalExpenses = await Expense.find({
      date: { $gte: threeMonthsAgo, $lt: today },
    });

    // Get all expense categories for context
    const expenseCategories = await Category.find({ type: 'expense' }).select('name');
    const allCategoryNames = expenseCategories.map(cat => cat.name);

    // Calculate current month's spending by category
    const currentMonthSpending = currentMonthExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    // Calculate historical average spending by category per month
    const historicalSpendingByMonthCategory = historicalExpenses.reduce((acc, expense) => {
      const monthYear = `${expense.month}-${expense.year}`;
      if (!acc[monthYear]) {
        acc[monthYear] = {};
      }
      acc[monthYear][expense.category] = (acc[monthYear][expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const monthlyCounts = {};
    for (const monthYear in historicalSpendingByMonthCategory) {
      const dateParts = monthYear.split('-');
      const month = parseInt(dateParts[0]);
      const year = parseInt(dateParts[1]);
      const monthDate = new Date(year, month - 1, 1); // Create a date object for the month
      const diffMonths = (today.getFullYear() - monthDate.getFullYear()) * 12 + (today.getMonth() - monthDate.getMonth());
      if (diffMonths > 0 && diffMonths <= 3) { // Count only within the last 3 months
          for (const category in historicalSpendingByMonthCategory[monthYear]) {
              monthlyCounts[category] = (monthlyCounts[category] || 0) + 1;
          }
      }
    }

    const historicalAverageSpending = {};
    for (const category of allCategoryNames) {
      let totalForCategory = 0;
      let countForCategory = 0;
      for (const monthYear in historicalSpendingByMonthCategory) {
        if (historicalSpendingByMonthCategory[monthYear][category]) {
          totalForCategory += historicalSpendingByMonthCategory[monthYear][category];
          countForCategory++;
        }
      }
      historicalAverageSpending[category] = countForCategory > 0 ? totalForCategory / countForCategory : 0;
    }

    // Prepare data for AI prompt
    let prompt = `Analyze my spending data and provide insights.
    All amounts are in INR.
    
    Current Month (${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}) Spending Breakdown:
    ${Object.keys(currentMonthSpending).length > 0
      ? Object.entries(currentMonthSpending).map(([cat, amt]) => `- ${cat}: ₹${amt.toFixed(2)}`).join('\n')
      : 'No expenses recorded for the current month.'}
    
    Historical Average Monthly Spending (based on last 3 months with data):
    ${Object.keys(historicalAverageSpending).length > 0
      ? Object.entries(historicalAverageSpending).map(([cat, avg]) => `- ${cat}: ₹${avg.toFixed(2)}`).join('\n')
      : 'No historical data available for averages.'}
    
    Provide insights on:
    1.  Significant changes (increases or decreases) in spending categories compared to historical averages. Quantify the change.
    2.  Potential reasons for these changes (e.g., seasonal, one-time, trend).
    3.  Suggestions for managing spending in categories with significant increases.
    4.  General financial health observations based on this data.
    5.  Keep the response concise, engaging, and easy to understand, using bullet points or short paragraphs.
    `;

    // Call the Gemini API
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    };

    // <--- IMPORTANT CHANGE HERE: Use process.env.GEMINI_API_KEY
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables.');
      return res.status(500).json({ error: 'Server configuration error: Gemini API key not found.' });
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    console.log('Calling Gemini API with payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Response:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Gemini API Raw Result:', JSON.stringify(result, null, 2));

    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      const aiResponseText = result.candidates[0].content.parts[0].text;
      res.status(200).json({ insights: aiResponseText });
    } else {
      console.error('Gemini API response structure unexpected:', result);
      res.status(500).json({ error: 'Failed to get insights from AI: Unexpected response structure.' });
    }

  } catch (err) {
    console.error('Backend: getSpendingInsights - Error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate spending insights.' });
  }
};
