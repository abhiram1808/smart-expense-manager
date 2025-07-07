import CommonExpense from '../models/CommonExpense.js';
import { generateMonthlyExpenses, logCommonExpenseChange } from '../utils/commonExpenseUtils.js';

// ✅ Create Common Expense
export const createCommonExpense = async (req, res) => {
  try {
    const commonExpense = await CommonExpense.create(req.body);

    // Generate monthly recurring entries
    const generatedCount = await generateMonthlyExpenses(commonExpense);

    // Log the action
    await logCommonExpenseChange({
      commonExpenseId: commonExpense._id,
      action: 'created',
      updatedData: commonExpense,
      description: `Created common expense ₹${commonExpense.amount} for ${commonExpense.duration} months`
    });

    res.status(201).json({
      message: 'Common Expense created',
      commonExpense,
      generatedEntries: generatedCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create common expense' });
  }
};
// ✅ Update Common Expense
export const updateCommonExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const commonExpense = await CommonExpense.findByIdAndUpdate(id
      , req.body, { new: true });
    if (!commonExpense) {
      return res.status(404).json({ error: 'Common Expense not found' });
    }
    // Log the action
    await logCommonExpenseChange({
      commonExpenseId: commonExpense._id,
      action: 'updated',
      previousData: req.body,
      updatedData: commonExpense,
      description: `Updated common expense ₹${commonExpense.amount} for ${commonExpense.duration} months`
    });
    res.status(200).json({
      message: 'Common Expense updated',
      commonExpense
    }); 
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: 'Failed to update common expense' });
  }
}
// ✅ Delete Common Expense   

export const deleteCommonExpense = async (req, res) => {  
  try {
    const { id } = req.params;
    const commonExpense = await CommonExpense.findByIdAndDelete(id);
    if (!commonExpense) {
      return res.status(404).json({ error: 'Common Expense not found' });
    }
    // Log the action
    await logCommonExpenseChange({
      commonExpenseId: commonExpense._id,
      action: 'deleted',
      previousData: commonExpense,
      updatedData: null,
      description: `Deleted common expense ₹${commonExpense.amount} for ${commonExpense.duration} months`
    });
    res.status(200).json({
      message: 'Common Expense deleted',
      commonExpense
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete common expense' });
  }
}

// ✅ Get Common Expense Logs
export const getCommonExpenseLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const logs = await CommonExpenseLog.find({ commonExpenseId: id }).sort({ createdAt: -1 });
    if (!logs.length) {
      return res.status(404).json({ error: 'No logs found for this common expense' });
    }
    res.status(200).json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch common expense logs' });
  }
}

// ✅ Get All Common Expenses
export const getAllCommonExpenses = async (req, res) => {
  try {
    const expenses = await CommonExpense.find().sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch common expenses' });
  }
};