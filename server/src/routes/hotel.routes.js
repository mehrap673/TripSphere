import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth.js';
import * as hotelController from '../controllers/hotel.Controller.js';

const router = express.Router();

// Public routes
router.get('/', hotelController.getAllHotels);
router.get('/featured', hotelController.getFeaturedHotels);
router.get('/search', hotelController.searchHotels);
router.get('/category/:category', hotelController.getHotelsByCategory);
router.get('/destination/:destinationId', hotelController.getHotelsByDestination);
router.get('/:id', hotelController.getHotelById);

// Protected routes (admin only)
router.post('/', authenticate, isAdmin, hotelController.createHotel);
router.put('/:id', authenticate, isAdmin, hotelController.updateHotel);
router.delete('/:id', authenticate, isAdmin, hotelController.deleteHotel);

export default router;
