// backend/index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors"; // Import the cors package
import dotenv from "dotenv";
import morgan from "morgan";
import cron from 'node-cron';

// Import all your existing routes
import expenseRoutes from './routes/expenseRoutes.js';
import incomeRoutes from './routes/incomeRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import commonExpenseRoutes from './routes/commonExpenseRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import alertRoutes from './routes/alertRoutes.js';

import { autoInsertCommonExpenses } from './utils/autoInsertCommonExpenses.js'; // <--- THIS MUST MATCH THE NAMED EXPORT

// ⏰ Cron job to run autoInsertCommonExpenses daily at 1:00 AM
// This schedule ('0 1 * * *') means: at minute 0, hour 1, every day of the month, every month, every day of the week.
cron.schedule('0 1 * * *', async () => { // <--- CRON SCHEDULE UPDATED TO DAILY
    console.log('🔁 Running daily common expenses auto-insertion job...');
    await autoInsertCommonExpenses();
});

dotenv.config(); // Load environment variables
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware Configuration ---
// THIS IS YOUR CORS MIDDLEWARE. It MUST be placed BEFORE your routes.
// It tells the browser that requests from http://localhost:5173 are allowed.
app.use(cors({
    origin: 'http://localhost:5173', // <--- DOUBLE-CHECK THIS EXACTLY MATCHES YOUR FRONTEND URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Ensure all HTTP methods you use are allowed
    allowedHeaders: ['Content-Type', 'Authorization'], // Ensure common headers are allowed
}));

// This middleware parses incoming JSON request bodies
app.use(express.json());

// This middleware logs HTTP requests to the console (e.g., GET /api/budget 200)
app.use(morgan("dev"));

// --- Root Route ---
app.get("/", (req, res) => {
    res.send("Expense Tracker API running...");
});

// --- Mount all your existing and new routes ---
// These routes will execute AFTER the middleware above has processed the request.
app.use('/api/expenses', expenseRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/common-expenses', commonExpenseRoutes); // Common Expenses routes are correctly mounted
app.use('/api/analytics', analyticsRoutes);
app.use('/api/alerts', alertRoutes);

// --- Database Connection and Server Start ---
mongoose.connect(process.env.MONGO_URI) // <--- DEPRECATED OPTIONS REMOVED
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.error("Mongo Error:", err));
