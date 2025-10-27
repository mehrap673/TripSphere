import { GoogleGenerativeAI } from '@google/generative-ai';
import Destination from '../models/Destination.js';
import Hotel from '../models/Hotel.js';
import Activity from '../models/Activity.js';

// Fallback recommendations
const fallbackRecommendations = [
  {
    name: 'Paris',
    country: 'France',
    description: 'The City of Light offers romance, culture, world-class museums, and incredible cuisine.',
    bestTime: 'April to June, September to October',
    budgetRange: '$1,500 - $3,000',
    activities: ['Eiffel Tower', 'Louvre Museum', 'Seine River Cruise', 'Montmartre']
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    description: 'A fascinating blend of ancient traditions and cutting-edge technology.',
    bestTime: 'March to May, September to November',
    budgetRange: '$2,000 - $4,000',
    activities: ['Senso-ji Temple', 'Shibuya Crossing', 'Mount Fuji', 'Tsukiji Market']
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    description: 'Tropical paradise with stunning beaches, temples, and rice terraces.',
    bestTime: 'April to October',
    budgetRange: '$800 - $2,000',
    activities: ['Ubud Rice Terraces', 'Beach Surfing', 'Temple Tours', 'Traditional Dance']
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    description: 'Vibrant Mediterranean city with Gaudí architecture and beaches.',
    bestTime: 'May to June, September to October',
    budgetRange: '$1,200 - $2,800',
    activities: ['Sagrada Familia', 'Park Güell', 'Beach', 'Gothic Quarter']
  },
  {
    name: 'New York',
    country: 'USA',
    description: 'The city that never sleeps with museums, shows, and iconic landmarks.',
    bestTime: 'April to June, September to November',
    budgetRange: '$2,500 - $5,000',
    activities: ['Central Park', 'Statue of Liberty', 'Times Square', 'Museums']
  }
];

// Helper to extract JSON
function extractJSON(text) {
  try {
    let cleaned = text.replace(/``````\n?/g, '').trim();
    const startIndex = cleaned.indexOf('[');
    const endIndex = cleaned.lastIndexOf(']');
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      return JSON.parse(cleaned.substring(startIndex, endIndex + 1));
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Recommend destinations
export const recommendDestinations = async (req, res) => {
  try {
    const { preferences, budget, travelStyle, duration, interests } = req.body;
    console.log('🤖 AI Recommendation Request:', { travelStyle, budget, duration, interests });

    // Initialize GenAI HERE on each request
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️ No API key - using fallback');
      const dbDestinations = await Destination.find().limit(10).sort({ 'rating.average': -1 });
      return res.json({
        success: true,
        aiRecommendations: fallbackRecommendations,
        popularDestinations: dbDestinations,
        fallback: true
      });
    }

    console.log('✅ API Key found, initializing Gemini...');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const interestsStr = Array.isArray(interests) && interests.length > 0 
      ? interests.join(', ') 
      : 'general travel';

    const prompt = `As a travel expert, recommend 5 travel destinations based on:
- Travel Style: ${travelStyle || 'general'}
- Budget: ${budget || 'moderate'}
- Duration: ${duration || 7} days
- Interests: ${interestsStr}

Return ONLY valid JSON array (no markdown):
[
  {
    "name": "City Name",
    "country": "Country",
    "description": "2-3 sentences max 150 chars",
    "bestTime": "Best months",
    "budgetRange": "$X,XXX - $X,XXX",
    "activities": ["activity1", "activity2", "activity3", "activity4"]
  }
]`;

    console.log('📤 Sending to Gemini...');
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log('📥 Response received');

    let aiRecommendations = extractJSON(text);
    
    if (!aiRecommendations || !Array.isArray(aiRecommendations) || aiRecommendations.length === 0) {
      console.warn('⚠️ Parse failed, using fallback');
      aiRecommendations = fallbackRecommendations;
    } else {
      console.log('✅ Parsed', aiRecommendations.length, 'recommendations');
    }

    const dbDestinations = await Destination.find().limit(10).sort({ 'rating.average': -1 });

    res.json({
      success: true,
      aiRecommendations: aiRecommendations,
      popularDestinations: dbDestinations
    });

  } catch (error) {
    console.error('❌ AI error:', error.message);
    
    try {
      const dbDestinations = await Destination.find().limit(10).sort({ 'rating.average': -1 });
      res.json({
        success: true,
        aiRecommendations: fallbackRecommendations,
        popularDestinations: dbDestinations,
        fallback: true
      });
    } catch (dbError) {
      res.status(500).json({ success: false, message: 'Error' });
    }
  }
};

// Suggest itinerary
export const suggestItinerary = async (req, res) => {
  try {
    const { destination, duration, interests, budget } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'AI not configured' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const interestsStr = Array.isArray(interests) ? interests.join(', ') : 'sightseeing';

    const prompt = `Create ${duration}-day itinerary for ${destination}:
- Budget: ${budget}
- Interests: ${interestsStr}

Return ONLY valid JSON array:
[
  {
    "day": 1,
    "title": "Day title",
    "morning": {"time": "9:00 AM", "activity": "Name", "description": "Details"},
    "afternoon": {"time": "2:00 PM", "activity": "Name", "description": "Details"},
    "evening": {"time": "7:00 PM", "activity": "Name", "description": "Details"},
    "budget": "$XXX",
    "tips": "One tip"
  }
]`;

    const result = await model.generateContent(prompt);
    const itinerary = extractJSON(result.response.text()) || [];

    res.json({ success: true, itinerary });
  } catch (error) {
    console.error('❌ Itinerary error:', error.message);
    res.status(500).json({ success: false, message: 'Error' });
  }
};

// Recommend hotels
export const recommendHotels = async (req, res) => {
  try {
    const { destinationId, budget } = req.body;
    const query = { destination: destinationId };
    
    if (budget === 'budget') {
      query['priceRange.max'] = { $lte: 100 };
    } else if (budget === 'luxury') {
      query['priceRange.min'] = { $gte: 200 };
    }

    const hotels = await Hotel.find(query).sort({ 'rating.averageScore': -1 }).limit(10);
    res.json({ success: true, hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};

// Recommend activities
export const recommendActivities = async (req, res) => {
  try {
    const { destinationId, interests } = req.body;
    const query = { destination: destinationId };
    
    if (Array.isArray(interests) && interests.length > 0) {
      query.tags = { $in: interests };
    }

    const activities = await Activity.find(query).sort({ 'rating.average': -1 }).limit(15);
    res.json({ success: true, activities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};

// Get travel tips
export const getTravelTips = async (req, res) => {
  try {
    const { destination, tripType } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'AI not configured' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `10 travel tips for ${destination} (${tripType} trip):

Return ONLY valid JSON array:
[
  {
    "category": "Category",
    "tip": "2-3 sentence tip"
  }
]

Cover: customs, accommodation, transport, safety, money, food, attractions, hidden gems, weather, communication`;

    const result = await model.generateContent(prompt);
    const tips = extractJSON(result.response.text()) || [];

    res.json({ success: true, tips });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};
