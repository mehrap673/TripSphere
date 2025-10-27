import Destination from '../models/Destination.js';
import { searchDestinations } from '../services/amadeusService.js';

// Get all destinations with Amadeus enrichment
export const getAllDestinations = async (req, res) => {
  try {
    const { category, search, sort, useAmadeus, limit = 50 } = req.query;
    
    console.log('📍 Destination search params:', { category, search, sort, useAmadeus, limit });
    
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') {
      sortOption = { 'rating.count': -1 };
    } else if (sort === 'rating') {
      sortOption = { 'rating.average': -1 };
    } else if (sort === 'name') {
      sortOption = { name: 1 };
    }

    // Fetch from MongoDB (fallback data)
    const dbDestinations = await Destination.find(query)
      .sort(sortOption)
      .limit(parseInt(limit));

    console.log('💾 MongoDB results:', dbDestinations.length);

    // Try Amadeus if requested OR if searching with no DB results
    const shouldUseAmadeus = useAmadeus === 'true' || (search && dbDestinations.length === 0);

    if (shouldUseAmadeus && search) {
      try {
        console.log('🌐 Calling Amadeus API for:', search);
        
        const amadeusResults = await searchDestinations(search, 20);
        console.log('✅ Amadeus returned:', amadeusResults.length, 'results');

        if (amadeusResults.length === 0) {
          // Return DB results if Amadeus has nothing
          return res.json({
            success: true,
            destinations: dbDestinations,
            source: 'database',
            message: 'No Amadeus results found, showing database results'
          });
        }

        // Transform Amadeus results to match your schema
        const transformedAmadeusResults = amadeusResults.map(am => ({
          _id: am.id,
          name: am.name,
          country: am.address?.countryName || am.address?.countryCode || 'Unknown',
          continent: getContinent(am.address?.countryCode),
          category: 'city',
          description: `Discover ${am.name}, ${am.address?.countryName || ''}`,
          coordinates: {
            lat: am.geoCode?.latitude || 0,
            lng: am.geoCode?.longitude || 0
          },
          rating: {
            average: 0,
            count: 0
          },
          averageCost: {
            budget: 50,
            moderate: 100,
            luxury: 200,
            currency: 'USD'
          },
          images: [getDefaultImage(am.address?.countryCode)],
          coverImage: getDefaultImage(am.address?.countryCode),
          amadeusInfo: {
            iataCode: am.iataCode,
            geoCode: am.geoCode,
            detailedName: am.detailedName,
            type: am.subType
          },
          dataSource: 'amadeus',
          views: 0,
          featured: false,
          trending: false,
          tags: [am.subType, 'travel', 'destination']
        }));

        // Merge DB results with Amadeus results
        const mergedResults = [...dbDestinations.map(d => ({
          ...d.toObject(),
          dataSource: 'database'
        })), ...transformedAmadeusResults];

        return res.json({
          success: true,
          destinations: mergedResults,
          source: dbDestinations.length > 0 ? 'hybrid' : 'amadeus',
          amadeusCount: transformedAmadeusResults.length,
          dbCount: dbDestinations.length
        });

      } catch (amadeusError) {
        console.error('❌ Amadeus API error:', amadeusError.message);
        console.error('Stack:', amadeusError.stack);
        
        // Return DB results as fallback
        return res.json({
          success: true,
          destinations: dbDestinations,
          source: 'database_fallback',
          error: 'Amadeus API unavailable, showing database results'
        });
      }
    }

    // Return MongoDB results only
    res.json({
      success: true,
      destinations: dbDestinations,
      source: 'database'
    });

  } catch (error) {
    console.error('❌ Get destinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching destinations',
      error: error.message
    });
  }
};

// Helper function to get continent from country code
function getContinent(countryCode) {
  const continentMap = {
    'IN': 'Asia', 'CN': 'Asia', 'JP': 'Asia', 'TH': 'Asia', 'SG': 'Asia',
    'US': 'North America', 'CA': 'North America', 'MX': 'North America',
    'GB': 'Europe', 'FR': 'Europe', 'DE': 'Europe', 'IT': 'Europe', 'ES': 'Europe',
    'AU': 'Oceania', 'NZ': 'Oceania',
    'BR': 'South America', 'AR': 'South America',
    'ZA': 'Africa', 'EG': 'Africa', 'KE': 'Africa'
  };
  return continentMap[countryCode] || 'Unknown';
}

// Helper function to get default images by country
function getDefaultImage(countryCode) {
  const imageMap = {
    'IN': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
    'US': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800',
    'GB': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
    'FR': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    'JP': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    'AU': 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800'
  };
  return imageMap[countryCode] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800';
}

// Get featured destinations
export const getFeaturedDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find({ featured: true })
      .sort({ 'rating.average': -1 })
      .limit(10);

    res.json({
      success: true,
      destinations,
      source: 'database'
    });
  } catch (error) {
    console.error('Get featured destinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured destinations'
    });
  }
};

// Get single destination
export const getDestinationById = async (req, res) => {
  try {
    const { enrichWithAmadeus = false } = req.query;
    
    const destination = await Destination.findById(req.params.id)
      .populate('reviews.user', 'name avatar');

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.json({
      success: true,
      destination,
      source: 'database'
    });
  } catch (error) {
    console.error('Get destination error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching destination'
    });
  }
};

// Create destination
export const createDestination = async (req, res) => {
  try {
    const destination = new Destination({
      ...req.body,
      createdBy: req.user._id
    });

    await destination.save();

    res.status(201).json({
      success: true,
      message: 'Destination created successfully',
      destination
    });
  } catch (error) {
    console.error('Create destination error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating destination'
    });
  }
};

// Update destination
export const updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.json({
      success: true,
      message: 'Destination updated successfully',
      destination
    });
  } catch (error) {
    console.error('Update destination error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating destination'
    });
  }
};

// Delete destination
export const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.json({
      success: true,
      message: 'Destination deleted successfully'
    });
  } catch (error) {
    console.error('Delete destination error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting destination'
    });
  }
};

// Add review
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    const existingReview = destination.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this destination'
      });
    }

    destination.reviews.push({
      user: req.user._id,
      rating,
      comment
    });

    const totalRating = destination.reviews.reduce((sum, r) => sum + r.rating, 0);
    destination.rating.average = totalRating / destination.reviews.length;
    destination.rating.count = destination.reviews.length;

    await destination.save();
    await destination.populate('reviews.user', 'name avatar');

    res.json({
      success: true,
      message: 'Review added successfully',
      destination
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding review'
    });
  }
};
