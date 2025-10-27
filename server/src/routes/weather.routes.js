import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as weatherController from '../controllers/weather.controller.js';

const router = express.Router();

// Get weather forecast for destination
router.get('/destination', authenticate, weatherController.getWeatherForecast);

// Get current weather
router.get('/current', authenticate, weatherController.getCurrentWeather);

export default router;
