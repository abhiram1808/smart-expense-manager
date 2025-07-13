// client/src/pages/CommonExpensesPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import useCommonExpenseData from '../hooks/useCommonExpenseData.js';
import useExpenses from '../hooks/useExpenseData.js';
import { fetchCategories } from '../services/categoryService.js';
import ActionModal from '../components/common/ActionModal';
import ErrorDisplay from '../components/common/ErrorDisplay';
import SkeletonLoader from '../components/common/SkeletonLoader';
import CommonExpenseList from '../components/CommonExpense/CommonExpenseList.jsx';
import { FaCalendarAlt, FaPlusCircle, FaEdit, FaTrashAlt, FaSyncAlt, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { toast } from 'react-toastify';

/**
 * Page component for managing Recurring Expense Templates (using CommonExpense model).
 * Allows users to define, view, edit, and delete templates for automated expense generation.
 * Includes active/pause toggle and dynamic category selection.
 */
const CommonExpensesPage = () => {
  const {
    commonExpenses: templates,
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    error,
    addCommonExpense: addTemplate,
    updateCommonExpense: updateTemplate,
    deleteCommonExpense: deleteTemplate,
    toggleTemplateActiveStatus,
    triggerGeneration,
    refetchCommonExpenses: refetchTemplates,
  } = useCommonExpenseData();

  // Use useExpenses to get categories from existing expense records
  const { expenses: allExistingExpenses } = useExpenses({
    defaultFilters: {},
    defaultSortBy: 'date',
    defaultSortOrder: 'desc',
  });

  // State for all categories from the Category model
  const [allCategoriesFromDb, setAllCategoriesFromDb] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState(null);

  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDeleteId, setTemplateToDeleteId] = useState(null);

  // Form state for adding/editing a template (matches CommonExpense schema)
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [dayOfMonth, setDayOfMonth] = useState('');
  const [startDate, setStartDate] = useState('');
  const [termMonths, setTermMonths] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Fetch all categories from the backend Category model
  useEffect(() => {
    const getCategories = async () => {
      setIsLoadingCategories(true);
      setCategoryError(null);
      try {
        const response = await fetchCategories(); // Use the service to fetch
        // FIX: Remove filter for 'expense' type, just map all category names
        const categoriesArr = Array.isArray(response.data) ? response.data : [];
        const expenseCategories = categoriesArr.map(cat => cat.name);
        setAllCategoriesFromDb(expenseCategories);
      } catch (err) {
        console.error('Error fetching categories from DB:', err.response?.data || err.message);
        setCategoryError(err);
        toast.error(`Failed to load categories: ${err.response?.data?.error || err.message}`);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    getCategories();
  }, []); // Run once on component mount

  // Populate form fields when editingTemplate changes
  useEffect(() => {
    if (editingTemplate) {
      setName(editingTemplate.name || '');
      setAmount(editingTemplate.amount || '');
      setCategory(editingTemplate.category || '');
      setDayOfMonth(editingTemplate.dayOfMonth || '');
      setStartDate(editingTemplate.startDate ? new Date(editingTemplate.startDate).toISOString().split('T')[0] : '');
      setTermMonths(editingTemplate.termMonths || '');
      setEndDate(editingTemplate.endDate ? new Date(editingTemplate.endDate).toISOString().split('T')[0] : '');
      setIsActive(editingTemplate.isActive !== undefined ? editingTemplate.isActive : true);
    } else {
      // Reset form for adding new template
      setName('');
      setAmount('');
      setCategory('');
      setDayOfMonth('');
      setStartDate('');
      setTermMonths('');
      setEndDate('');
      setIsActive(true); // Default to active for new templates
    }
  }, [editingTemplate]);

  // Dynamic Category List: Combine categories from existing expenses and from the Category model
  const uniqueCategories = useMemo(() => {
    console.log('DEBUG: Categories from existing expenses:', allExistingExpenses.map(exp => exp.category)); // <--- DEBUG LOG 3
    console.log('DEBUG: Categories from DB state (allCategoriesFromDb):', allCategoriesFromDb); // <--- DEBUG LOG 4

    const categoriesFromExpenses = allExistingExpenses.map(exp => exp.category);
    const combinedCategories = [...new Set([...categoriesFromExpenses, ...allCategoriesFromDb])];
    console.log('DEBUG: Combined unique categories before sort:', combinedCategories); // <--- DEBUG LOG 5
    return ['', ...combinedCategories.sort()]; // Add empty string for default, then sort
  }, [allExistingExpenses, allCategoriesFromDb]);


  // Handlers for Add/Edit Form Modal
  const handleAddEditClick = (template = null) => {
    setEditingTemplate(template);
    setShowAddEditModal(true);
  };

  const handleAddEditSubmit = async (e) => {
    e.preventDefault();
    if (!name || !amount || !category || !dayOfMonth || !startDate) {
      toast.error('Please fill all required fields (Name, Amount, Category, Day of Month, Start Date).');
      return;
    }

    const templateData = {
      name,
      amount: parseFloat(amount),
      category,
      dayOfMonth: parseInt(dayOfMonth),
      startDate,
      termMonths: termMonths ? parseInt(termMonths) : null,
      endDate: endDate || null,
      isActive,
    };

    try {
      if (editingTemplate) {
        await updateTemplate(editingTemplate._id, templateData);
      } else {
        await addTemplate(templateData);
      }
      setShowAddEditModal(false);
    } catch (err) {
      // Error handled by useCommonExpenseData hook
    }
  };

  // Handlers for Delete Confirmation
  const handleDeleteClick = (id) => {
    setTemplateToDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (templateToDeleteId) {
      try {
        await deleteTemplate(templateToDeleteId);
      } catch (err) {
        console.log('Error deleting template:', err);
        toast.error(`Failed to delete template: ${err.response?.data?.error || err.message}`);
        // Error handled by useCommonExpenseData hook
      } finally {
        setShowDeleteModal(false);
        setTemplateToDeleteId(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setTemplateToDeleteId(null);
  };

  // Toggle Active Status
  const handleToggleActive = async (templateId, currentStatus) => {
    try {
      await toggleTemplateActiveStatus(templateId, currentStatus);
    } catch (err) {
      console.error('Error toggling active status:', err);
      // Error handled by useCommonExpenseData hook
    }
  };

  // Manual Trigger for Automation
  const handleTriggerGeneration = async () => {
    try {
      toast.info('Triggering recurring expense generation...');
      await triggerGeneration();
      // After generation, it's often useful to refetch the main expenses list
      // to see the newly generated items immediately on Daily/History pages.
      // You would need to pass refetchExpenses from useExpenses to this page or trigger it globally.
    } catch (err) {
      // Error handled by useCommonExpenseData hook
    }
  };

  // Generate dayOfMonth options
  const dayOfMonthOptions = useMemo(() => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    return ['', ...days]; // Add empty string for default
  }, []);

  console.log('CommonExpensesPage: Templates received:', templates);
  console.log('CommonExpensesPage: Templates array length:', templates.length);


  if (isLoading || isLoadingCategories) { // Check both loading states
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-primary"><FaCalendarAlt className="me-2" />Recurring Expenses</h2>
        <SkeletonLoader count={1} type="card" className="mb-4" />
        <SkeletonLoader count={5} type="table-row" />
      </div>
    );
  }

  if (error || categoryError) { // Check both error states
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-primary"><FaCalendarAlt className="me-2" />Recurring Expenses</h2>
        <ErrorDisplay
          error={error || categoryError}
          message="Failed to load recurring expense templates or categories."
        />
        <p className="text-center mt-3">Please ensure your backend server is running and accessible.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-primary"><FaCalendarAlt className="me-2" />Recurring Expenses</h2>

      {/* Action Buttons */}
      <div className="d-flex justify-content-end mb-4 gap-2">
        <button
          className="btn btn-success d-flex align-items-center"
          onClick={() => handleAddEditClick()} // Open modal for adding
          disabled={isAdding}
        >
          <FaPlusCircle className="me-2" />
          {isAdding ? 'Adding...' : 'Add New Recurring Expense'}
        </button>
        <button
          className="btn btn-info d-flex align-items-center text-white"
          onClick={handleTriggerGeneration}
          disabled={isLoading || isAdding || isUpdating || isDeleting}
          title="Manually trigger generation of overdue recurring expenses"
        >
          <FaSyncAlt className="me-2" />
          Trigger Automation
        </button>
      </div>

      {/* Recurring Expense Templates Table */}
      <CommonExpenseList
        commonExpenses={templates} // Pass templates to the list component
        onUpdate={updateTemplate}
        onDelete={deleteTemplate}
        isLoading={isLoading}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        uniqueCategories={uniqueCategories}
        onEditClick={handleAddEditClick} // Pass the handler to open edit modal
        onToggleActive={handleToggleActive} // Pass the toggle handler
      />

      {templates.length === 0 && !isLoading && (
        <p className="text-center text-muted py-4 mb-0">No recurring expense templates found. Click "Add New Recurring Expense" to create one.</p>
      )}

      {/* Add/Edit Recurring Expense Modal */}
      <ActionModal
        show={showAddEditModal}
        type="form"
        title={editingTemplate ? 'Edit Recurring Expense Template' : 'Add New Recurring Expense Template'}
        onClose={() => setShowAddEditModal(false)}
        confirmButtonText={editingTemplate ? (isUpdating ? 'Updating...' : 'Update') : (isAdding ? 'Adding...' : 'Add')}
        confirmButtonClass={editingTemplate ? 'btn-primary' : 'btn-success'}
        cancelButtonClass="btn-secondary"
        isConfirmDisabled={isAdding || isUpdating}
        formId="recurring-expense-form" // Unique ID for the form
      >
        <form id="recurring-expense-form" onSubmit={handleAddEditSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Amount</label>
            <input
              type="number"
              className="form-control"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              className="form-select"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="dayOfMonth" className="form-label">Day of Month</label>
            <select
              className="form-select"
              id="dayOfMonth"
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
              required
            >
              <option value="">Select Day</option>
              {dayOfMonthOptions.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="startDate" className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="termMonths" className="form-label">Term (Months) - Optional</label>
            <input
              type="number"
              className="form-control"
              id="termMonths"
              value={termMonths}
              onChange={(e) => setTermMonths(e.target.value)}
              min="1"
              placeholder="e.g., 12 for 1 year"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">End Date (Optional)</label>
            <input
              type="date"
              className="form-control"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="isActive">
              Is Active
            </label>
          </div>
        </form>
      </ActionModal>

      {/* Delete Confirmation Modal (used by CommonExpenseListItem) */}
      <ActionModal
        show={showDeleteModal}
        type="delete"
        title="Confirm Delete Recurring Expense Template?"
        message="Are you sure you want to delete this recurring expense template? This will stop future automatic insertions."
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
        confirmButtonText={isDeleting ? 'Deleting...' : 'Delete'}
        confirmButtonClass="btn-danger"
        cancelButtonClass="btn-secondary"
      />
    </div>
  );
};

export default CommonExpensesPage;

