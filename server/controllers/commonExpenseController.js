// server/controllers/commonExpenseController.js
import CommonExpense from '../models/CommonExpense.js';
import Expense from '../models/Expense.js';
import moment from 'moment';

// @desc    Create a new common expense template (recurring expense)
// @route   POST /api/common-expenses
// @access  Public (add auth later if needed)
export const createCommonExpense = async (req, res) => {
  try {
    const { name, category, amount, dayOfMonth, startDate, termMonths, endDate, isActive } = req.body;

    const newCommonExpense = new CommonExpense({
      name,
      category,
      amount,
      dayOfMonth,
      startDate: new Date(startDate),
      termMonths: termMonths || null,
      endDate: endDate ? new Date(endDate) : null,
      isActive: isActive !== undefined ? isActive : true,
      // user: req.user.id, // Uncomment if user is mandatory
    });

    const savedCommonExpense = await newCommonExpense.save();
    res.status(201).json(savedCommonExpense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Get all common expense templates
// @route   GET /api/common-expenses
// @access  Public
export const getCommonExpenses = async (req, res) => {
  try {
    console.log('Backend: getCommonExpenses - Attempting to fetch all templates...');
    // const commonExpenses = await CommonExpense.find({ user: req.user.id }); // Uncomment if user is mandatory
    const commonExpenses = await CommonExpense.find({});
    console.log('Backend: getCommonExpenses - Fetched templates count:', commonExpenses.length);
    res.status(200).json(commonExpenses);
  } catch (err) {
    console.error('Backend: getCommonExpenses - Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update a common expense template
// @route   PUT /api/common-expenses/:id
// @access  Public
export const updateCommonExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedFields = {};

    if (updates.name !== undefined) updatedFields.name = updates.name;
    if (updates.category !== undefined) updatedFields.category = updates.category;
    if (updates.amount !== undefined) updatedFields.amount = updates.amount;
    if (updates.dayOfMonth !== undefined) updatedFields.dayOfMonth = updates.dayOfMonth;

    if (updates.startDate !== undefined) {
      const date = new Date(updates.startDate);
      if (!isNaN(date.getTime())) {
        updatedFields.startDate = date;
      } else if (updates.startDate === null || updates.startDate === '') {
        updatedFields.startDate = null;
      } else {
        throw new Error('Invalid startDate provided.');
      }
    }

    if (updates.endDate !== undefined) {
      const date = new Date(updates.endDate);
      if (!isNaN(date.getTime())) {
        updatedFields.endDate = date;
      } else if (updates.endDate === null || updates.endDate === '') {
        updatedFields.endDate = null;
      } else {
        throw new Error('Invalid endDate provided.');
      }
    }

    if (updates.termMonths !== undefined) {
        updatedFields.termMonths = updates.termMonths === null ? null : (updates.termMonths || null);
    }

    if (updates.isActive !== undefined) {
        updatedFields.isActive = updates.isActive;
    }

    const updatedCommonExpense = await CommonExpense.findByIdAndUpdate(id, updatedFields, { new: true, runValidators: true });
    if (!updatedCommonExpense) {
      return res.status(404).json({ error: 'Common expense template not found' });
    }
    res.status(200).json(updatedCommonExpense);
  } catch (err) {
    console.error('Backend: updateCommonExpense - Error:', err);
    res.status(400).json({ error: err.message });
  }
};

// @desc    Delete a common expense template
// @route   DELETE /api/common-expenses/:id
// @access  Public
export const deleteCommonExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCommonExpense = await CommonExpense.findByIdAndDelete(id);
    if (!deletedCommonExpense) {
      return res.status(404).json({ error: 'Common expense template not found' });
    }
    res.status(200).json({ message: 'Common expense template deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Generate recurring expenses based on active common expense templates
// @route   POST /api/common-expenses/generate (for manual trigger)
// @access  Public (should be restricted in production)
export const generateRecurringExpenses = async (req, res) => {
  try {
    const today = moment().startOf('day');
    console.log(`Automation: Running generation for date: ${today.format('YYYY-MM-DD')}`);

    const templates = await CommonExpense.find({
      isActive: true,
      startDate: { $lte: today.toDate() },
      $or: [
        { endDate: { $gte: today.toDate() } },
        { endDate: null }
      ]
    });

    let generatedCount = 0;
    const generatedExpenses = [];

    for (const template of templates) {
      const lastInsertedMoment = template.lastInsertedDate ? moment(template.lastInsertedDate).startOf('day') : null;
      let nextExpectedDate = lastInsertedMoment ? lastInsertedMoment.clone().add(1, 'month') : moment(template.startDate).startOf('day');
      nextExpectedDate.date(template.dayOfMonth);

      if (lastInsertedMoment && nextExpectedDate.isSameOrBefore(lastInsertedMoment, 'day')) {
          nextExpectedDate = lastInsertedMoment.clone().add(1, 'month').date(template.dayOfMonth);
      }
      nextExpectedDate.date(Math.min(template.dayOfMonth, nextExpectedDate.daysInMonth()));


      while (nextExpectedDate.isSameOrBefore(today, 'day')) {
        if (template.endDate && nextExpectedDate.isAfter(moment(template.endDate).endOf('day'), 'day')) {
          console.log(`Automation: Template ${template.name} (${template._id}) reached end date. Stopping.`);
          break;
        }

        const existingExpense = await Expense.findOne({
          recurringTemplateId: template._id,
          date: nextExpectedDate.toDate(),
          // user: template.user
        });

        if (!existingExpense) {
          const newExpense = new Expense({
            description: template.name,
            amount: template.amount,
            category: template.category,
            date: nextExpectedDate.toDate(),
            month: nextExpectedDate.month() + 1,
            year: nextExpectedDate.year(),
            // user: template.user,
            isRecurring: true,
            recurringTemplateId: template._id,
          });
          const savedExpense = await newExpense.save();
          generatedExpenses.push(savedExpense);
          generatedCount++;
          console.log(`Generated expense for ${template.name} on ${nextExpectedDate.format('YYYY-MM-DD')}`);
        } else {
          console.log(`Expense for ${template.name} on ${nextExpectedDate.format('YYYY-MM-DD')} already exists. Skipping.`);
        }

        nextExpectedDate.add(1, 'month');
        nextExpectedDate.date(Math.min(template.dayOfMonth, nextExpectedDate.daysInMonth()));
      }

      if (lastInsertedMoment === null || lastInsertedMoment.isBefore(today, 'day')) {
        template.lastInsertedDate = today.toDate();
        await template.save();
        console.log(`Updated lastInsertedDate for ${template.name} to ${today.format('YYYY-MM-DD')}`);
      }
    }

    console.log(`Automation: Generated ${generatedCount} new recurring expenses.`);
    res.status(200).json({ message: `Generated ${generatedCount} new recurring expenses.`, generatedExpenses });
  } catch (err) {
    console.error('Automation Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get common expense summary by category
// @route   GET /api/common-expenses/summary/category
// @access  Public
export const getCommonExpenseSummaryByCategory = async (req, res) => {
  try {
    const summary = await CommonExpense.aggregate([
      { $match: { isActive: true } }, // Only consider active templates
      { $group: { _id: '$category', totalAmount: { $sum: '$amount' } } },
      { $sort: { totalAmount: -1 } },
    ]);
    res.status(200).json(summary);
  } catch (err) {
    console.error('Backend: getCommonExpenseSummaryByCategory - Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get common expense summary by day of month
// @route   GET /api/common-expenses/summary/day-of-month
// @access  Public
export const getCommonExpenseSummaryByDayOfMonth = async (req, res) => {
  try {
    const summary = await CommonExpense.aggregate([
      { $match: { isActive: true } }, // Only consider active templates
      { $group: { _id: '$dayOfMonth', totalAmount: { $sum: '$amount' } } },
      { $sort: { _id: 1 } }, // Sort by day of month ascending
    ]);
    res.status(200).json(summary);
  } catch (err) {
    console.error('Backend: getCommonExpenseSummaryByDayOfMonth - Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get total amount of all active common expenses
// @route   GET /api/common-expenses/total-active
// @access  Public
export const getTotalActiveCommonExpensesAmount = async (req, res) => {
  try {
    const result = await CommonExpense.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
    ]);
    const totalAmount = result.length > 0 ? result[0].totalAmount : 0;
    res.status(200).json({ totalAmount });
  } catch (err) {
    console.error('Backend: getTotalActiveCommonExpensesAmount - Error:', err);
    res.status(500).json({ error: err.message });
  }
};
