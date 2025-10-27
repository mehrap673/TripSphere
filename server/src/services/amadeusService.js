import Amadeus from 'amadeus';

let amadeus = null;

const getAmadeusClient = () => {
  if (!amadeus) {
    if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
      throw new Error('Amadeus credentials not configured. Please check your .env file.');
    }
    
    amadeus = new Amadeus({
      clientId: process.env.AMADEUS_CLIENT_ID,
      clientSecret: process.env.AMADEUS_CLIENT_SECRET,
      hostname: process.env.AMADEUS_HOSTNAME || 'test'
    });
    
    console.log('✅ Amadeus client initialized successfully');
  }
  return amadeus;
};

// ✅ IMPROVED: Search for destinations with country filtering
export const searchDestinations = async (keyword, limit = 10) => {
  try {
    const client = getAmadeusClient();
    
    // Search for cities AND countries
    const response = await client.referenceData.locations.get({
      keyword: keyword,
      subType: 'CITY,AIRPORT',
      'page[limit]': limit * 3 // Get more results to filter
    });

    const results = response.data || [];
    
    // ✅ Filter and prioritize results
    const filtered = results.filter(location => {
      const name = location.name?.toLowerCase() || '';
      const country = location.address?.countryName?.toLowerCase() || '';
      const countryCode = location.address?.countryCode || '';
      const searchTerm = keyword.toLowerCase();
      
      // If searching for a country, prioritize that country's cities
      if (searchTerm === 'india') {
        return countryCode === 'IN';
      }
      if (searchTerm === 'france') {
        return countryCode === 'FR';
      }
      if (searchTerm === 'japan') {
        return countryCode === 'JP';
      }
      if (searchTerm === 'usa' || searchTerm === 'america') {
        return countryCode === 'US';
      }
      
      // For other searches, check if country name matches
      if (country.includes(searchTerm)) {
        return true;
      }
      
      // Or if city name matches exactly
      return name.toLowerCase() === searchTerm;
    });

    // If we have filtered results, use those, otherwise use all results
    const finalResults = filtered.length > 0 ? filtered : results;
    
    return finalResults.slice(0, limit);
  } catch (error) {
    console.error('Amadeus destinations search error:', error.response?.data || error.message);
    throw new Error('Failed to search destinations');
  }
};

// Rest of your functions remain the same...
export const getDestinationDetails = async (locationId) => {
  try {
    const client = getAmadeusClient();
    const response = await client.referenceData.locations(locationId).get();
    return response.data;
  } catch (error) {
    console.error('Amadeus destination details error:', error.response);
    throw new Error('Failed to get destination details');
  }
};

export const searchHotelsByCity = async (cityCode, checkInDate, checkOutDate, adults = 2, rooms = 1) => {
  try {
    const client = getAmadeusClient();
    const response = await client.shopping.hotelOffers.get({
      cityCode: cityCode,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      adults: adults,
      roomQuantity: rooms,
      radius: 50,
      radiusUnit: 'KM'
    });
    return response.data;
  } catch (error) {
    console.error('Amadeus hotels search error:', error.response);
    throw new Error('Failed to search hotels');
  }
};

export const searchHotelsByGeocode = async (latitude, longitude, radius = 50) => {
  try {
    const client = getAmadeusClient();
    const response = await client.shopping.hotelOffers.get({
      latitude: latitude,
      longitude: longitude,
      radius: radius,
      radiusUnit: 'KM'
    });
    return response.data;
  } catch (error) {
    console.error('Amadeus hotels by geocode error:', error.response);
    throw new Error('Failed to search hotels by location');
  }
};

export const getHotelDetails = async (hotelId) => {
  try {
    const client = getAmadeusClient();
    const response = await client.shopping.hotel(hotelId).get();
    return response.data;
  } catch (error) {
    console.error('Amadeus hotel details error:', error.response);
    throw new Error('Failed to get hotel details');
  }
};

export const searchActivities = async (latitude, longitude, radius = 50) => {
  try {
    const client = getAmadeusClient();
    const response = await client.shopping.activities.get({
      latitude: latitude,
      longitude: longitude,
      radius: radius
    });
    return response.data;
  } catch (error) {
    console.error('Amadeus activities search error:', error.response);
    throw new Error('Failed to search activities');
  }
};

export const getActivityDetails = async (activityId) => {
  try {
    const client = getAmadeusClient();
    const response = await client.shopping.activity(activityId).get();
    return response.data;
  } catch (error) {
    console.error('Amadeus activity details error:', error.response);
    throw new Error('Failed to get activity details');
  }
};

export const searchFlights = async (origin, destination, departureDate, returnDate, adults = 1) => {
  try {
    const client = getAmadeusClient();
    const response = await client.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      returnDate: returnDate,
      adults: adults,
      max: 10
    });
    return response.data;
  } catch (error) {
    console.error('Amadeus flights search error:', error.response);
    throw new Error('Failed to search flights');
  }
};

export default { getAmadeusClient };
