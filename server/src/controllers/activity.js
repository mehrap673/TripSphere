import Activity from '../models/Activity.js';
import { 
  searchActivities as amadeusSearchActivities, 
  getActivityDetails 
} from '../services/amadeusService.js';

// Helper function to transform Amadeus activity data
const transformAmadeusActivity = (amadeusActivity, destinationId = null) => {
  return {
    name: amadeusActivity.name,
    amadeusId: amadeusActivity.id,
    description: amadeusActivity.shortDescription || '',
    type: amadeusActivity.type || 'Activity',
    location: {
      type: 'Point',
      coordinates: [
        amadeusActivity.geoCode?.longitude || 0,
        amadeusActivity.geoCode?.latitude || 0
      ]
    },
    rating: {
      average: parseFloat(amadeusActivity.rating || 0),
      count: 0
    },
    pricing: {
      amount: parseFloat(amadeusActivity.price?.amount || 0),
      currency: amadeusActivity.price?.currencyCode || 'USD'
    },
    images: amadeusActivity.pictures || [],
    bookingLink: amadeusActivity.bookingLink,
    destination: destinationId,
    dataSource: 'amadeus'
  };
};

// Get activities by destination with Amadeus enrichment
export const getActivitiesByDestination = async (req, res) => {
  try {
    const { type, sort, useAmadeus = false } = req.query;
    let query = { destination: req.params.destinationId };

    if (type) {
      query.type = type;
    }

    let sortOption = { 'rating.average': -1 };
    if (sort === 'price-low') {
      sortOption = { 'pricing.amount': 1 };
    } else if (sort === 'price-high') {
      sortOption = { 'pricing.amount': -1 };
    }

    // Fetch from MongoDB (fallback)
    const dbActivities = await Activity.find(query)
      .populate('destination', 'name location')
      .sort(sortOption);

    // Try Amadeus enrichment if requested
    if (useAmadeus === 'true') {
      try {
        const destination = await Activity.findOne(query).populate('destination');
        
        if (!destination?.destination?.location?.coordinates) {
          throw new Error('Destination coordinates not found');
        }

        const amadeusActivities = await amadeusSearchActivities(
          destination.destination.location.coordinates[1], // latitude
          destination.destination.location.coordinates[0], // longitude
          50 // radius in km
        );

        // Merge with MongoDB data
        const enrichedActivities = dbActivities.map(dbActivity => {
          const amadeusMatch = amadeusActivities.find(
            aa => aa.name?.toLowerCase().includes(dbActivity.name.toLowerCase())
          );

          if (amadeusMatch) {
            return {
              ...dbActivity.toObject(),
              amadeusData: {
                bookingLink: amadeusMatch.bookingLink,
                minimumDuration: amadeusMatch.minimumDuration,
                pictures: amadeusMatch.pictures
              },
              dataSource: 'hybrid'
            };
          }

          return { ...dbActivity.toObject(), dataSource: 'database' };
        });

        // Add Amadeus-only activities
        const amadeusOnlyActivities = amadeusActivities
          .filter(aa => !dbActivities.some(
            dba => dba.name.toLowerCase().includes(aa.name?.toLowerCase())
          ))
          .slice(0, 10)
          .map(aa => transformAmadeusActivity(aa, req.params.destinationId));

        return res.json({
          success: true,
          activities: [...enrichedActivities, ...amadeusOnlyActivities],
          source: 'hybrid',
          count: enrichedActivities.length + amadeusOnlyActivities.length
        });
      } catch (amadeusError) {
        console.error('Amadeus activities search failed:', amadeusError.message);
        // Fall through to return MongoDB data
      }
    }

    res.json({
      success: true,
      activities: dbActivities,
      source: 'database',
      count: dbActivities.length
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activities'
    });
  }
};

// Get single activity with Amadeus details
export const getActivityById = async (req, res) => {
  try {
    const { enrichWithAmadeus = false } = req.query;
    
    const activity = await Activity.findById(req.params.id)
      .populate('destination');

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Enrich with Amadeus if requested and activity has amadeusId
    if (enrichWithAmadeus === 'true' && activity.amadeusId) {
      try {
        const amadeusDetails = await getActivityDetails(activity.amadeusId);
        
        return res.json({
          success: true,
          activity: {
            ...activity.toObject(),
            amadeusData: amadeusDetails,
            dataSource: 'hybrid'
          }
        });
      } catch (amadeusError) {
        console.error('Amadeus activity details failed:', amadeusError.message);
        // Fall through to return MongoDB data
      }
    }

    res.json({
      success: true,
      activity,
      source: 'database'
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activity'
    });
  }
};

// Get all activities
export const getAllActivities = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const activities = await Activity.find()
      .populate('destination', 'name country')
      .sort({ 'rating.average': -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      activities,
      source: 'database',
      count: activities.length
    });
  } catch (error) {
    console.error('Get all activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activities'
    });
  }
};

// Get featured activities
export const getFeaturedActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const activities = await Activity.find({ featured: true })
      .populate('destination', 'name country')
      .limit(limit)
      .sort({ 'rating.average': -1 });

    res.json({
      success: true,
      activities,
      source: 'database',
      count: activities.length
    });
  } catch (error) {
    console.error('Get featured activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured activities'
    });
  }
};

// Search activities with Amadeus fallback
export const searchActivitiesController = async (req, res) => {
  try {
    const { q, useAmadeus = false } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Search MongoDB first (fallback)
    const dbActivities = await Activity.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    }).populate('destination', 'name country');

    // Try Amadeus if requested
    if (useAmadeus === 'true') {
      try {
        const { searchDestinations } = await import('../services/amadeusService.js');
        const destinations = await searchDestinations(q, 3);
        
        if (destinations.length > 0 && destinations[0].geoCode) {
          const amadeusActivities = await amadeusSearchActivities(
            destinations[0].geoCode.latitude,
            destinations[0].geoCode.longitude
          );

          const transformedActivities = amadeusActivities
            .slice(0, 10)
            .map(aa => transformAmadeusActivity(aa));

          return res.json({
            success: true,
            count: dbActivities.length + transformedActivities.length,
            activities: [
              ...dbActivities.map(a => ({ ...a.toObject(), dataSource: 'database' })),
              ...transformedActivities
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
      activities: dbActivities,
      source: 'database',
      count: dbActivities.length
    });
  } catch (error) {
    console.error('Search activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching activities'
    });
  }
};

// Get activities by type
export const getActivitiesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const activities = await Activity.find({ type })
      .populate('destination', 'name country')
      .sort({ 'rating.average': -1 });

    res.json({
      success: true,
      activities,
      source: 'database',
      count: activities.length
    });
  } catch (error) {
    console.error('Get activities by type error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activities by type'
    });
  }
};

// Create activity
export const createActivity = async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();

    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      activity
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating activity'
    });
  }
};

// Update activity
export const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.json({
      success: true,
      message: 'Activity updated successfully',
      activity
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating activity'
    });
  }
};

// Delete activity
export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting activity'
    });
  }
};
