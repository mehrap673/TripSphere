import Hotel from '../models/Hotel.js';
import { 
  searchHotelsByCity, 
  searchHotelsByGeocode,
  getHotelDetails 
} from '../services/amadeusService.js';

// Helper function to transform Amadeus hotel data to match your schema
const transformAmadeusHotel = (amadeusHotel, destinationId = null) => {
  return {
    name: amadeusHotel.hotel?.name || 'Unknown Hotel',
    amadeusId: amadeusHotel.hotel?.hotelId,
    address: amadeusHotel.hotel?.address?.lines?.join(', '),
    cityCode: amadeusHotel.hotel?.cityCode,
    location: {
      type: 'Point',
      coordinates: [
        amadeusHotel.hotel?.longitude || 0,
        amadeusHotel.hotel?.latitude || 0
      ]
    },
    rating: {
      stars: amadeusHotel.hotel?.rating || 0,
      averageScore: amadeusHotel.hotel?.rating || 0
    },
    priceRange: {
      min: parseFloat(amadeusHotel.offers?.[0]?.price?.total || 0),
      max: parseFloat(amadeusHotel.offers?.[0]?.price?.total || 0),
      currency: amadeusHotel.offers?.[0]?.price?.currency || 'USD'
    },
    amenities: amadeusHotel.hotel?.amenities || [],
    images: amadeusHotel.hotel?.media?.map(m => m.uri) || [],
    destination: destinationId,
    dataSource: 'amadeus'
  };
};

// Get hotels by destination with Amadeus enrichment
export const getHotelsByDestination = async (req, res) => {
  try {
    const { 
      minPrice, 
      maxPrice, 
      stars, 
      sort, 
      useAmadeus = false,
      checkInDate,
      checkOutDate,
      adults = 2
    } = req.query;
    
    let query = { destination: req.params.destinationId };

    if (minPrice || maxPrice) {
      query['priceRange.min'] = {};
      if (minPrice) query['priceRange.min'].$gte = parseFloat(minPrice);
      if (maxPrice) query['priceRange.max'].$lte = parseFloat(maxPrice);
    }

    if (stars) {
      query['rating.stars'] = parseInt(stars);
    }

    let sortOption = { 'rating.averageScore': -1 };
    if (sort === 'price-low') {
      sortOption = { 'priceRange.min': 1 };
    } else if (sort === 'price-high') {
      sortOption = { 'priceRange.min': -1 };
    }

    // Fetch from MongoDB (fallback)
    const dbHotels = await Hotel.find(query)
      .populate('destination', 'name cityCode location')
      .sort(sortOption);

    // Try Amadeus enrichment if requested
    if (useAmadeus === 'true') {
      try {
        const destination = await Hotel.findOne(query).populate('destination');
        
        if (!destination?.destination) {
          throw new Error('Destination not found for Amadeus search');
        }

        let amadeusHotels = [];

        // Search by city code if available
        if (destination.destination.cityCode && checkInDate && checkOutDate) {
          amadeusHotels = await searchHotelsByCity(
            destination.destination.cityCode,
            checkInDate,
            checkOutDate,
            parseInt(adults)
          );
        } 
        // Or search by geocode
        else if (destination.destination.location?.coordinates) {
          amadeusHotels = await searchHotelsByGeocode(
            destination.destination.location.coordinates[1], // latitude
            destination.destination.location.coordinates[0]  // longitude
          );
        }

        // Merge Amadeus data with MongoDB data
        const enrichedHotels = dbHotels.map(dbHotel => {
          const amadeusMatch = amadeusHotels.find(
            ah => ah.hotel?.name?.toLowerCase().includes(dbHotel.name.toLowerCase())
          );

          if (amadeusMatch) {
            return {
              ...dbHotel.toObject(),
              amadeusData: {
                offers: amadeusMatch.offers,
                available: amadeusMatch.available,
                lastUpdateDateTime: amadeusMatch.lastUpdateDateTime
              },
              dataSource: 'hybrid'
            };
          }

          return { ...dbHotel.toObject(), dataSource: 'database' };
        });

        // Add Amadeus-only hotels that aren't in database
        const amadeusOnlyHotels = amadeusHotels
          .filter(ah => !dbHotels.some(
            dbh => dbh.name.toLowerCase().includes(ah.hotel?.name?.toLowerCase())
          ))
          .slice(0, 10)
          .map(ah => transformAmadeusHotel(ah, req.params.destinationId));

        return res.json({
          success: true,
          hotels: [...enrichedHotels, ...amadeusOnlyHotels],
          source: 'hybrid',
          count: enrichedHotels.length + amadeusOnlyHotels.length
        });
      } catch (amadeusError) {
        console.error('Amadeus hotel search failed, using fallback:', amadeusError.message);
        // Fall through to return MongoDB data
      }
    }

    res.json({
      success: true,
      hotels: dbHotels,
      source: 'database',
      count: dbHotels.length
    });
  } catch (error) {
    console.error('Get hotels error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hotels'
    });
  }
};

// Get single hotel with Amadeus details
export const getHotelById = async (req, res) => {
  try {
    const { enrichWithAmadeus = false } = req.query;
    
    const hotel = await Hotel.findById(req.params.id)
      .populate('destination');

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Enrich with Amadeus if requested and hotel has amadeusId
    if (enrichWithAmadeus === 'true' && hotel.amadeusId) {
      try {
        const amadeusDetails = await getHotelDetails(hotel.amadeusId);
        
        return res.json({
          success: true,
          hotel: {
            ...hotel.toObject(),
            amadeusData: amadeusDetails,
            dataSource: 'hybrid'
          }
        });
      } catch (amadeusError) {
        console.error('Amadeus hotel details failed:', amadeusError.message);
        // Fall through to return MongoDB data
      }
    }

    res.json({
      success: true,
      hotel,
      source: 'database'
    });
  } catch (error) {
    console.error('Get hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hotel'
    });
  }
};

// Get all hotels
export const getAllHotels = async (req, res) => {
  try {
    const { category, featured, limit = 50 } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (featured) filter.featured = true;

    const hotels = await Hotel.find(filter)
      .populate('destination', 'name country')
      .sort({ 'rating.averageScore': -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: hotels.length,
      hotels,
      source: 'database'
    });
  } catch (error) {
    console.error('Get all hotels error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hotels'
    });
  }
};

// Get featured hotels
export const getFeaturedHotels = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const hotels = await Hotel.find({ featured: true })
      .populate('destination', 'name country')
      .sort({ 'rating.averageScore': -1 })
      .limit(limit);

    res.json({
      success: true,
      count: hotels.length,
      hotels,
      source: 'database'
    });
  } catch (error) {
    console.error('Get featured hotels error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured hotels'
    });
  }
};

// Search hotels with Amadeus fallback
export const searchHotels = async (req, res) => {
  try {
    const { q, useAmadeus = false } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Search MongoDB first (fallback)
    const dbHotels = await Hotel.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { address: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    }).populate('destination', 'name country');

    // Try Amadeus if requested
    if (useAmadeus === 'true') {
      try {
        // Search destinations first, then hotels
        const { searchDestinations } = require('../services/amadeusService.js');
        const destinations = await searchDestinations(q, 5);
        
        if (destinations.length > 0) {
          const cityCode = destinations[0].iataCode;
          const amadeusHotels = await searchHotelsByCity(
            cityCode,
            new Date().toISOString().split('T')[0],
            new Date(Date.now() + 86400000).toISOString().split('T')[0]
          );

          const transformedHotels = amadeusHotels
            .slice(0, 10)
            .map(ah => transformAmadeusHotel(ah));

          return res.json({
            success: true,
            count: dbHotels.length + transformedHotels.length,
            hotels: [
              ...dbHotels.map(h => ({ ...h.toObject(), dataSource: 'database' })),
              ...transformedHotels
            ],
            source: 'hybrid'
          });
        }
      } catch (amadeusError) {
        console.error('Amadeus search failed:', amadeusError.message);
        // Fall through to return MongoDB data
      }
    }

    res.json({
      success: true,
      count: dbHotels.length,
      hotels: dbHotels,
      source: 'database'
    });
  } catch (error) {
    console.error('Search hotels error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching hotels'
    });
  }
};

// Get hotels by category
export const getHotelsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const hotels = await Hotel.find({ category })
      .populate('destination', 'name country')
      .sort({ 'rating.averageScore': -1 });

    res.json({
      success: true,
      count: hotels.length,
      hotels,
      source: 'database'
    });
  } catch (error) {
    console.error('Get hotels by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hotels by category'
    });
  }
};

// Create hotel
export const createHotel = async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();

    res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      hotel
    });
  } catch (error) {
    console.error('Create hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating hotel'
    });
  }
};

// Update hotel
export const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.json({
      success: true,
      message: 'Hotel updated successfully',
      hotel
    });
  } catch (error) {
    console.error('Update hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating hotel'
    });
  }
};

// Delete hotel
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.json({
      success: true,
      message: 'Hotel deleted successfully'
    });
  } catch (error) {
    console.error('Delete hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting hotel'
    });
  }
};
