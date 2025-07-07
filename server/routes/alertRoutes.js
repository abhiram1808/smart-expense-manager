// routes/alertRoutes.js
import express from 'express';
import Alert from '../models/Alert.js';

const router = express.Router();

// GET all alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch alerts', error: err.message });
  }
});

// POST a new alert
router.post('/', async (req, res) => {
  try {
    const alert = new Alert(req.body);
    const saved = await alert.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save alert', error: err.message });
  }
});

export default router;
