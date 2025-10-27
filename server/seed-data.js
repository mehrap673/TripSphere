import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Destination from './src/models/Destination.js';
import Trip from './src/models/Trip.js';
import Hotel from './src/models/Hotel.js';
import Activity from './src/models/Activity.js';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Sample Users Data
const users = [
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        avatar: 'https://i.pravatar.cc/150?img=1',
        bio: 'Travel enthusiast and photographer',
        preferences: {
            currency: 'USD',
            language: 'en',
            notifications: {
                email: true,
                push: true,
                tripReminders: true,
                budgetAlerts: true
            }
        },
        gamification: {
            level: 5,
            points: 1250,
            badges: [
                { name: 'First Trip', icon: '🎯', description: 'Completed your first trip', earnedAt: new Date('2024-01-15') },
                { name: 'Budget Master', icon: '💰', description: 'Stayed under budget 5 times', earnedAt: new Date('2024-03-20') },
                { name: 'Globe Trotter', icon: '🌍', description: 'Visited 10 destinations', earnedAt: new Date('2024-06-10') }
            ]
        }
    },
    {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: 'password123',
        avatar: 'https://i.pravatar.cc/150?img=5',
        bio: 'Adventure seeker and food lover',
        preferences: {
            currency: 'EUR',
            language: 'en',
            notifications: {
                email: true,
                push: false,
                tripReminders: true,
                budgetAlerts: true
            }
        },
        gamification: {
            level: 3,
            points: 750,
            badges: [
                { name: 'First Trip', icon: '🎯', description: 'Completed your first trip', earnedAt: new Date('2024-02-10') }
            ]
        }
    },
    {
        name: 'Mike Chen',
        email: 'mike@example.com',
        password: 'password123',
        avatar: 'https://i.pravatar.cc/150?img=12',
        bio: 'Business traveler and tech enthusiast',
        preferences: {
            currency: 'USD',
            language: 'en',
            notifications: {
                email: true,
                push: true,
                tripReminders: true,
                budgetAlerts: false
            }
        },
        gamification: {
            level: 7,
            points: 2100,
            badges: [
                { name: 'First Trip', icon: '🎯', description: 'Completed your first trip', earnedAt: new Date('2023-11-05') },
                { name: 'Budget Master', icon: '💰', description: 'Stayed under budget 5 times', earnedAt: new Date('2024-01-15') },
                { name: 'Globe Trotter', icon: '🌍', description: 'Visited 10 destinations', earnedAt: new Date('2024-04-20') },
                { name: 'Social Butterfly', icon: '🦋', description: 'Shared 10 trips', earnedAt: new Date('2024-07-10') }
            ]
        }
    }
];

// Sample Destinations Data - FIXED FORMAT
const destinations = [
    {
        name: 'Paris, France',
        description: 'The City of Light, known for its art, fashion, gastronomy, and culture.',
        country: 'France',
        continent: 'Europe',
        coordinates: {
            lat: 48.8566,
            lng: 2.3522
        },
        category: 'city',
        popularityScore: 95,
        averageCost: {
            budget: 80,
            moderate: 150,
            luxury: 300,
            currency: 'USD'
        },
        bestTimeToVisit: {
            months: ['April', 'May', 'September', 'October'],
            description: 'Spring and fall offer pleasant weather and fewer crowds'
        },
        images: [
            'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
            'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f'
        ],
        coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
        popularActivities: ['City tours', 'Museum visits', 'River cruises', 'Wine tasting', 'Shopping'],
        mustVisit: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Arc de Triomphe', 'Champs-Élysées'],
        tags: ['romantic', 'culture', 'art', 'fashion', 'historical'],
        climate: 'Temperate oceanic',
        languages: ['French'],
        currency: 'EUR',
        timezone: 'CET (UTC+1)',
        featured: true,
        trending: true
    },
    {
        name: 'Tokyo, Japan',
        description: 'A vibrant metropolis blending traditional culture with cutting-edge technology.',
        country: 'Japan',
        continent: 'Asia',
        coordinates: {
            lat: 35.6895,
            lng: 139.6917
        },
        category: 'city',
        averageCost: {
            budget: 60,
            moderate: 120,
            luxury: 250,
            currency: 'USD'
        },
        bestTimeToVisit: {
            months: ['March', 'April', 'October', 'November'],
            description: 'Cherry blossom season in spring and fall foliage'
        },
        images: [
            'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
            'https://images.unsplash.com/photo-1513407030348-c983a97b98d8'
        ],
        coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
        popularActivities: ['Temple visits', 'Shopping', 'Food tours', 'Technology exhibitions', 'Cherry blossom viewing'],
        mustVisit: ['Senso-ji Temple', 'Tokyo Skytree', 'Shibuya Crossing', 'Meiji Shrine', 'Imperial Palace'],
        tags: ['technology', 'culture', 'food', 'shopping', 'modern'],
        climate: 'Humid subtropical',
        languages: ['Japanese'],
        currency: 'JPY',
        timezone: 'JST (UTC+9)',
        featured: true,
        trending: true
    },
    {
        name: 'Bali, Indonesia',
        description: 'Tropical paradise known for beaches, rice terraces, and spiritual culture.',
        country: 'Indonesia',
        continent: 'Asia',
        coordinates: {
            lat: -8.4095,
            lng: 115.1889
        },
        category: 'beach',
        averageCost: {
            budget: 30,
            moderate: 70,
            luxury: 150,
            currency: 'USD'
        },
        bestTimeToVisit: {
            months: ['April', 'May', 'June', 'September'],
            description: 'Dry season with pleasant weather'
        },
        images: [
            'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19'
        ],
        coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
        popularActivities: ['Surfing', 'Temple visits', 'Yoga retreats', 'Snorkeling', 'Spa treatments'],
        mustVisit: ['Tanah Lot Temple', 'Ubud Monkey Forest', 'Tegallalang Rice Terraces', 'Mount Batur', 'Seminyak Beach'],
        tags: ['beach', 'tropical', 'spiritual', 'relaxation', 'nature'],
        climate: 'Tropical',
        languages: ['Indonesian', 'Balinese'],
        currency: 'IDR',
        timezone: 'WITA (UTC+8)',
        featured: true,
        trending: true
    },
    {
        name: 'New York City, USA',
        description: 'The city that never sleeps, a global hub for business, culture, and entertainment.',
        country: 'United States',
        continent: 'North America',
        coordinates: {
            lat: 40.7128,
            lng: -74.0060
        },
        category: 'city',
        averageCost: {
            budget: 100,
            moderate: 200,
            luxury: 400,
            currency: 'USD'
        },
        bestTimeToVisit: {
            months: ['April', 'May', 'September', 'October'],
            description: 'Spring and fall with mild temperatures'
        },
        images: [
            'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
            'https://images.unsplash.com/photo-1522083165195-3424ed129620'
        ],
        coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
        popularActivities: ['Broadway shows', 'Museum visits', 'Shopping', 'Food tours', 'Rooftop bars'],
        mustVisit: ['Statue of Liberty', 'Central Park', 'Times Square', 'Empire State Building', 'Brooklyn Bridge'],
        tags: ['urban', 'culture', 'entertainment', 'shopping', 'nightlife'],
        climate: 'Humid continental',
        languages: ['English'],
        currency: 'USD',
        timezone: 'EST (UTC-5)',
        featured: true,
        trending: true
    },
    {
        name: 'Dubai, UAE',
        description: 'Futuristic city in the desert with luxury shopping, ultramodern architecture, and lively nightlife.',
        country: 'United Arab Emirates',
        continent: 'Asia',
        coordinates: {
            lat: 25.2048,
            lng: 55.2708
        },
        category: 'city',
        averageCost: {
            budget: 80,
            moderate: 180,
            luxury: 350,
            currency: 'USD'
        },
        bestTimeToVisit: {
            months: ['November', 'December', 'January', 'February', 'March'],
            description: 'Winter months with pleasant temperatures'
        },
        images: [
            'https://images.unsplash.com/photo-1512453979798-5ea266f8880c',
            'https://images.unsplash.com/photo-1518684079-3c830dcef090'
        ],
        coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c',
        popularActivities: ['Shopping', 'Desert safari', 'Skydiving', 'Water parks', 'Luxury dining'],
        mustVisit: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Dubai Marina', 'Gold Souk'],
        tags: ['luxury', 'modern', 'shopping', 'desert', 'architecture'],
        climate: 'Hot desert',
        languages: ['Arabic', 'English'],
        currency: 'AED',
        timezone: 'GST (UTC+4)',
        featured: true,
        trending: false
    },
    {
        name: 'Rome, Italy',
        description: 'The Eternal City, home to ancient ruins, Vatican City, and incredible Italian cuisine.',
        country: 'Italy',
        continent: 'Europe',
        coordinates: {
            lat: 41.9028,
            lng: 12.4964
        },
        category: 'historical',
        averageCost: {
            budget: 70,
            moderate: 140,
            luxury: 280,
            currency: 'USD'
        },
        bestTimeToVisit: {
            months: ['April', 'May', 'September', 'October'],
            description: 'Spring and fall with comfortable weather'
        },
        images: [
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
            'https://images.unsplash.com/photo-1525874684015-58379d421a52'
        ],
        coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
        popularActivities: ['Historical tours', 'Food tasting', 'Museum visits', 'Wine tours', 'Walking tours'],
        mustVisit: ['Colosseum', 'Vatican Museums', 'Trevi Fountain', 'Pantheon', 'Roman Forum'],
        tags: ['historical', 'culture', 'food', 'art', 'ancient'],
        climate: 'Mediterranean',
        languages: ['Italian'],
        currency: 'EUR',
        timezone: 'CET (UTC+1)',
        featured: true,
        trending: true
    },
    {
        name: 'Santorini, Greece',
        description: 'Stunning Greek island famous for whitewashed buildings, blue-domed churches, and spectacular sunsets.',
        country: 'Greece',
        continent: 'Europe',
        coordinates: {
            lat: 36.3932,
            lng: 25.4615
        },
        category: 'island',
        averageCost: {
            budget: 60,
            moderate: 130,
            luxury: 300,
            currency: 'USD'
        },
        bestTimeToVisit: {
            months: ['April', 'May', 'September', 'October'],
            description: 'Shoulder season with great weather and fewer crowds'
        },
        images: [
            'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e',
            'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff'
        ],
        coverImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e',
        popularActivities: ['Sunset viewing', 'Wine tasting', 'Beach relaxation', 'Boat tours', 'Photography'],
        mustVisit: ['Oia Village', 'Red Beach', 'Akrotiri Archaeological Site', 'Fira', 'Amoudi Bay'],
        tags: ['romantic', 'beach', 'scenic', 'photography', 'wine'],
        climate: 'Mediterranean',
        languages: ['Greek'],
        currency: 'EUR',
        timezone: 'EET (UTC+2)',
        featured: true,
        trending: true
    },
    {
        name: 'Maldives',
        description: 'Tropical paradise with crystal-clear waters, luxury resorts, and pristine white-sand beaches.',
        country: 'Maldives',
        continent: 'Asia',
        coordinates: {
            lat: 3.2028,
            lng: 73.2207
        },
        category: 'island',
        averageCost: {
            budget: 100,
            moderate: 250,
            luxury: 500,
            currency: 'USD'
        },
        bestTimeToVisit: {
            months: ['November', 'December', 'January', 'February', 'March', 'April'],
            description: 'Dry season with excellent diving conditions'
        },
        images: [
            'https://images.unsplash.com/photo-1514282401047-d79a71a590e8',
            'https://images.unsplash.com/photo-1573843981267-be1999ff37cd'
        ],
        coverImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8',
        popularActivities: ['Snorkeling', 'Scuba diving', 'Water sports', 'Spa treatments', 'Island hopping'],
        mustVisit: ['Malé', 'Vaadhoo Island', 'Banana Reef', 'Maafushi Island', 'Ari Atoll'],
        tags: ['luxury', 'beach', 'honeymoon', 'diving', 'relaxation'],
        climate: 'Tropical',
        languages: ['Dhivehi', 'English'],
        currency: 'MVR',
        timezone: 'MVT (UTC+5)',
        featured: true,
        trending: true
    },
    {
        name: 'Barcelona, Spain',
        description: 'Vibrant coastal city known for Gaudí architecture, beaches, and lively culture.',
        country: 'Spain',
        continent: 'Europe',
        coordinates: {
            lat: 41.3874,
            lng: 2.1686
        },
        category: 'city',
        averageCost: {
            budget: 60,
            moderate: 120,
            luxury: 250,
            currency: 'USD'
        },
        bestTimeToVisit: {
            months: ['May', 'June', 'September', 'October'],
            description: 'Late spring and early fall with perfect beach weather'
        },
        images: [
            'https://images.unsplash.com/photo-1583422409516-2895a77efded',
            'https://images.unsplash.com/photo-1562883676-8c7feb83f09b'
        ],
        coverImage: 'https://images.unsplash.com/photo-1583422409516-2895a77efded',
        popularActivities: ['Architecture tours', 'Beach relaxation', 'Tapas tasting', 'Shopping', 'Nightlife'],
        mustVisit: ['Sagrada Familia', 'Park Güell', 'La Rambla', 'Gothic Quarter', 'Casa Batlló'],
        tags: ['architecture', 'beach', 'culture', 'food', 'art'],
        climate: 'Mediterranean',
        languages: ['Spanish', 'Catalan'],
        currency: 'EUR',
        timezone: 'CET (UTC+1)',
        featured: true,
        trending: false
    },
    {
        name: 'London, United Kingdom',
        description: 'Historic capital city with royal palaces, world-class museums, and diverse culture.',
        country: 'United Kingdom',
        continent: 'Europe',
        coordinates: {
            lat: 51.5074,
            lng: -0.1278
        },
        category: 'city',
        averageCost: {
            budget: 80,
            moderate: 160,
            luxury: 350,
            currency: 'USD'
        },
        bestTimeToVisit: {
            months: ['May', 'June', 'July', 'August', 'September'],
            description: 'Summer months with long daylight hours'
        },
        images: [
            'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
            'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9'
        ],
        coverImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
        popularActivities: ['Museum visits', 'Theatre shows', 'Shopping', 'River cruises', 'Pub culture'],
        mustVisit: ['Big Ben', 'Tower of London', 'British Museum', 'Buckingham Palace', 'London Eye'],
        tags: ['historical', 'culture', 'royal', 'museums', 'theatre'],
        climate: 'Temperate oceanic',
        languages: ['English'],
        currency: 'GBP',
        timezone: 'GMT (UTC+0)',
        featured: true,
        trending: false
    }
];


// Sample Trips Data
// Sample Hotels Data
const createSampleHotels = (destinations) => {
    const hotels = [];

    destinations.forEach(destination => {
        // Create 2-3 hotels per destination
        const numHotels = Math.floor(Math.random() * 2) + 2;

        for (let i = 0; i < numHotels; i++) {
            const hotelTypes = ['hotel', 'resort', 'hostel', 'apartment', 'villa', 'guesthouse'];
            const randomType = hotelTypes[Math.floor(Math.random() * hotelTypes.length)];

            hotels.push({
                name: `${['Grand', 'Luxury', 'Budget', 'Comfort', 'Royal', 'Paradise'][Math.floor(Math.random() * 6)]} ${randomType === 'hotel' ? 'Hotel' : randomType.charAt(0).toUpperCase() + randomType.slice(1)} ${destination.name.split(',')[0]}`,
                destination: destination._id,
                address: `${Math.floor(Math.random() * 999) + 1} Main Street, ${destination.name}`,
                coordinates: {
                    lat: destination.coordinates.lat + (Math.random() - 0.5) * 0.1,
                    lng: destination.coordinates.lng + (Math.random() - 0.5) * 0.1
                },
                images: [
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945',
                    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
                    'https://images.unsplash.com/photo-1618773928121-c32242e63f39'
                ],
                coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
                description: `Experience luxury and comfort at our ${randomType} in the heart of ${destination.name}. Featuring modern amenities, stunning views, and excellent service.`,
                rating: {
                    stars: Math.floor(Math.random() * 3) + 3, // 3-5 stars
                    reviews: Math.floor(Math.random() * 500) + 50,
                    averageScore: (Math.random() * 2 + 3).toFixed(1) // 3.0-5.0
                },
                priceRange: {
                    min: Math.floor(Math.random() * 100) + 50,
                    max: Math.floor(Math.random() * 300) + 150,
                    currency: 'USD'
                },
                amenities: [
                    'Free WiFi',
                    'Swimming Pool',
                    'Fitness Center',
                    'Restaurant',
                    'Room Service',
                    'Spa',
                    'Bar',
                    'Parking',
                    'Airport Shuttle',
                    'Concierge',
                    'Laundry Service',
                    '24/7 Front Desk'
                ].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 6) + 6),
                roomTypes: [
                    {
                        name: 'Standard Room',
                        description: 'Comfortable room with essential amenities',
                        price: Math.floor(Math.random() * 80) + 60,
                        capacity: 2,
                        beds: '1 Queen Bed',
                        size: '25 sqm',
                        features: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'],
                        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304'],
                        available: true
                    },
                    {
                        name: 'Deluxe Room',
                        description: 'Spacious room with premium amenities',
                        price: Math.floor(Math.random() * 120) + 100,
                        capacity: 2,
                        beds: '1 King Bed',
                        size: '35 sqm',
                        features: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony', 'Coffee Maker'],
                        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427'],
                        available: true
                    },
                    {
                        name: 'Suite',
                        description: 'Luxurious suite with separate living area',
                        price: Math.floor(Math.random() * 200) + 180,
                        capacity: 4,
                        beds: '1 King Bed + Sofa Bed',
                        size: '55 sqm',
                        features: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony', 'Coffee Maker', 'Living Room', 'Kitchenette'],
                        images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd'],
                        available: true
                    }
                ],
                policies: {
                    checkIn: '3:00 PM',
                    checkOut: '11:00 AM',
                    cancellation: 'Free cancellation up to 24 hours before check-in',
                    children: 'Children of all ages are welcome',
                    pets: 'Pets not allowed'
                },
                contactInfo: {
                    phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
                    email: `info@hotel${i + 1}${destination.name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
                    website: `https://www.hotel${i + 1}.com`
                },
                category: randomType,
                featured: Math.random() > 0.7,
                verified: true,
                views: Math.floor(Math.random() * 5000) + 500,
                bookings: Math.floor(Math.random() * 1000) + 100
            });
        }
    });

    return hotels;
};

// Sample Activities Data
const createSampleActivities = (destinations) => {
    const activities = [];

    const activityTemplates = [
        { type: 'sightseeing', names: ['City Tour', 'Historical Walk', 'Landmarks Tour', 'Photography Tour'] },
        { type: 'restaurant', names: ['Fine Dining Experience', 'Local Food Tour', 'Street Food Adventure', 'Cooking Class'] },
        { type: 'adventure', names: ['Hiking Expedition', 'Rock Climbing', 'Zip Lining', 'Parasailing', 'Bungee Jumping'] },
        { type: 'cultural', names: ['Museum Visit', 'Cultural Show', 'Art Gallery Tour', 'Traditional Dance Performance'] },
        { type: 'shopping', names: ['Shopping Tour', 'Local Market Visit', 'Souvenir Shopping', 'Fashion District Tour'] },
        { type: 'nightlife', names: ['Pub Crawl', 'Nightclub Experience', 'Rooftop Bar Hopping', 'Live Music Night'] },
        { type: 'nature', names: ['Nature Walk', 'Wildlife Safari', 'Bird Watching', 'Botanical Garden Visit'] },
        { type: 'sports', names: ['Diving Experience', 'Surfing Lessons', 'Kayaking Tour', 'Cycling Tour'] },
        { type: 'wellness', names: ['Spa Day', 'Yoga Retreat', 'Meditation Session', 'Hot Springs Visit'] },
        { type: 'entertainment', names: ['Theme Park Visit', 'Water Park Day', 'Show Tickets', 'Concert Experience'] }
    ];

    destinations.forEach(destination => {
        // Create 5-8 activities per destination
        const numActivities = Math.floor(Math.random() * 4) + 5;

        for (let i = 0; i < numActivities; i++) {
            const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
            const activityName = template.names[Math.floor(Math.random() * template.names.length)];

            activities.push({
                name: `${activityName} in ${destination.name.split(',')[0]}`,
                destination: destination._id,
                type: template.type,
                description: `Experience an amazing ${activityName.toLowerCase()} in ${destination.name}. This activity offers unforgettable memories and unique experiences.`,
                shortDescription: `${activityName} in ${destination.name.split(',')[0]}`,
                images: [
                    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
                    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1'
                ],
                coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
                location: {
                    address: `${Math.floor(Math.random() * 999) + 1} Activity Street, ${destination.name}`,
                    coordinates: {
                        lat: destination.coordinates.lat + (Math.random() - 0.5) * 0.1,
                        lng: destination.coordinates.lng + (Math.random() - 0.5) * 0.1
                    },
                    area: destination.name.split(',')[0]
                },
                pricing: {
                    amount: Math.floor(Math.random() * 150) + 20,
                    currency: 'USD',
                    priceType: ['per person', 'per group'][Math.floor(Math.random() * 2)]
                },
                duration: ['2 hours', '3 hours', '4 hours', 'Half day', 'Full day'][Math.floor(Math.random() * 5)],
                rating: {
                    average: (Math.random() * 2 + 3).toFixed(1),
                    count: Math.floor(Math.random() * 300) + 20
                },
                openingHours: {
                    monday: '9:00 AM - 6:00 PM',
                    tuesday: '9:00 AM - 6:00 PM',
                    wednesday: '9:00 AM - 6:00 PM',
                    thursday: '9:00 AM - 6:00 PM',
                    friday: '9:00 AM - 8:00 PM',
                    saturday: '9:00 AM - 8:00 PM',
                    sunday: '10:00 AM - 6:00 PM'
                },
                bestTimeToVisit: ['Morning', 'Afternoon', 'Evening', 'Sunset'][Math.floor(Math.random() * 4)],
                seasonality: 'year-round',
                difficulty: ['easy', 'moderate', 'challenging'][Math.floor(Math.random() * 3)],
                ageRestriction: {
                    minimum: Math.floor(Math.random() * 8),
                    maximum: 99
                },
                groupSize: {
                    minimum: 1,
                    maximum: Math.floor(Math.random() * 20) + 5
                },
                tags: destination.tags.concat(['popular', 'recommended', 'must-do']).slice(0, 5),
                includes: ['Professional guide', 'All entrance fees', 'Hotel pickup'],
                excludes: ['Meals', 'Personal expenses', 'Tips'],
                requirements: ['Comfortable shoes', 'Sunscreen', 'Water bottle'],
                whatToBring: ['Camera', 'Hat', 'Light jacket'],
                bookingRequired: Math.random() > 0.5,
                bookingUrl: `https://booking.example.com/activity${i + 1}`,
                cancellationPolicy: 'Free cancellation up to 24 hours in advance',
                contactInfo: {
                    phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
                    email: `info@activity${i + 1}.com`,
                    website: `https://www.activity${i + 1}.com`
                },
                featured: Math.random() > 0.7,
                verified: true,
                views: Math.floor(Math.random() * 3000) + 200,
                bookings: Math.floor(Math.random() * 500) + 50
            });
        }
    });

    return activities;
};

// Enhanced Sample Trips with detailed days and activities
const createSampleTrips = (users, destinations) => {
    const trips = [];
    const tripTypes = ['beach', 'city', 'adventure', 'cultural', 'business', 'relaxation', 'family', 'solo'];
    const statuses = ['planning', 'confirmed', 'ongoing', 'completed'];

    // Create 25 trips
    for (let i = 0; i < 25; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomDestination = destinations[Math.floor(Math.random() * destinations.length)];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const startDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        const numDays = Math.floor(Math.random() * 8) + 3;
        const endDate = new Date(startDate.getTime() + numDays * 24 * 60 * 60 * 1000);

        // Create detailed days
        const days = [];
        for (let d = 0; d < numDays; d++) {
            const dayDate = new Date(startDate.getTime() + d * 24 * 60 * 60 * 1000);
            const numActivities = Math.floor(Math.random() * 4) + 2;

            const dayActivities = [];
            for (let a = 0; a < numActivities; a++) {
                const activityTypes = ['sightseeing', 'restaurant', 'shopping', 'entertainment', 'other'];
                dayActivities.push({
                    name: ['Morning', 'Lunch', 'Afternoon', 'Dinner', 'Evening'][a] + ' Activity',
                    type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
                    location: {
                        name: randomDestination.name,
                        coordinates: {
                            lat: randomDestination.coordinates.lat,
                            lng: randomDestination.coordinates.lng
                        },
                        address: `Location in ${randomDestination.name}`
                    },
                    startTime: `${8 + a * 3}:00`,
                    endTime: `${10 + a * 3}:00`,
                    duration: '2 hours',
                    cost: Math.floor(Math.random() * 100) + 20,
                    currency: 'USD',
                    notes: 'Great experience!',
                    completed: randomStatus === 'completed' ? true : Math.random() > 0.5,
                    rating: Math.floor(Math.random() * 2) + 4
                });
            }

            days.push({
                date: dayDate,
                dayNumber: d + 1,
                title: `Day ${d + 1} in ${randomDestination.name.split(',')[0]}`,
                activities: dayActivities,
                notes: 'Exciting day ahead!',
                weather: {
                    temperature: Math.floor(Math.random() * 15) + 15,
                    feelsLike: Math.floor(Math.random() * 15) + 15,
                    condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
                    description: 'Pleasant weather',
                    icon: '01d',
                    humidity: Math.floor(Math.random() * 40) + 40,
                    windSpeed: Math.floor(Math.random() * 20) + 5
                },
                totalCost: dayActivities.reduce((sum, act) => sum + act.cost, 0)
            });
        }

        const totalBudget = Math.floor(Math.random() * 3000) + 1000;
        const totalSpent = Math.floor(Math.random() * 2000) + 500;

        trips.push({
            title: `${['Amazing', 'Incredible', 'Unforgettable', 'Perfect', 'Dream'][Math.floor(Math.random() * 5)]} Trip to ${randomDestination.name}`,
            description: `Exploring the beautiful ${randomDestination.name} with amazing experiences and unforgettable memories.`,
            coverImage: randomDestination.coverImage,
            images: randomDestination.images.slice(0, 3),
            destination: randomDestination._id,
            owner: randomUser._id,
            startDate,
            endDate,
            travelers: Math.floor(Math.random() * 4) + 1,
            tripType: tripTypes[Math.floor(Math.random() * tripTypes.length)],
            status: randomStatus,
            visibility: ['public', 'private', 'friends'][Math.floor(Math.random() * 3)],
            days: days,
            budget: {
                total: totalBudget,
                spent: totalSpent,
                currency: 'USD',
                breakdown: {
                    accommodation: Math.floor(totalSpent * 0.35),
                    food: Math.floor(totalSpent * 0.25),
                    transport: Math.floor(totalSpent * 0.20),
                    activities: Math.floor(totalSpent * 0.15),
                    shopping: Math.floor(totalSpent * 0.03),
                    other: Math.floor(totalSpent * 0.02)
                }
            },
            tags: randomDestination.tags.slice(0, 3),
            notes: 'Looking forward to this trip!',
            packingList: [
                { item: 'Passport', packed: true, category: 'Documents' },
                { item: 'Clothes', packed: false, category: 'Clothing' },
                { item: 'Camera', packed: true, category: 'Electronics' },
                { item: 'Sunscreen', packed: false, category: 'Toiletries' }
            ],
            accommodation: [{
                name: `Hotel in ${randomDestination.name.split(',')[0]}`,
                type: 'hotel',
                checkIn: startDate,
                checkOut: endDate,
                address: `123 Main St, ${randomDestination.name}`,
                coordinates: randomDestination.coordinates,
                bookingReference: `BK${Math.floor(Math.random() * 1000000)}`,
                cost: Math.floor(totalSpent * 0.35),
                rating: Math.floor(Math.random() * 2) + 4
            }],
            isPublic: Math.random() > 0.5,
            collaborators: [],
            bookmarks: [],
            views: Math.floor(Math.random() * 1000) + 50,
            likes: []
        });
    }

    return trips;
};


// Main seed function
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Destination.deleteMany({});
        await Trip.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // Hash passwords and create users
        console.log('👥 Creating users...');
        const hashedUsers = await Promise.all(
            users.map(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                return { ...user, password: hashedPassword };
            })
        );
        const createdUsers = await User.insertMany(hashedUsers);
        console.log(`✅ Created ${createdUsers.length} users\n`);

        // Create destinations
        console.log('🗺️  Creating destinations...');
        const createdDestinations = await Destination.insertMany(destinations);
        console.log(`✅ Created ${createdDestinations.length} destinations\n`);

        // Create hotels
        console.log('🏨 Creating hotels...');
        const sampleHotels = createSampleHotels(createdDestinations);
        const createdHotels = await Hotel.insertMany(sampleHotels);
        console.log(`✅ Created ${createdHotels.length} hotels\n`);

        // Create activities
        console.log('🎯 Creating activities...');
        const sampleActivities = createSampleActivities(createdDestinations);
        const createdActivities = await Activity.insertMany(sampleActivities);
        console.log(`✅ Created ${createdActivities.length} activities\n`);

        // Create trips (use updated function)
        console.log('✈️  Creating trips...');
        const sampleTrips = createSampleTrips(createdUsers, createdDestinations);
        const createdTrips = await Trip.insertMany(sampleTrips);
        console.log(`✅ Created ${createdTrips.length} trips\n`);
        console.log('🎉 Database seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - Users: ${createdUsers.length}`);
        console.log(`   - Destinations: ${createdDestinations.length}`);
        console.log(`   - Trips: ${createdTrips.length}`);
              console.log(`   - Hotels: ${createdHotels.length}`);
        console.log(`   - Activities: ${createdActivities.length}`);
        console.log(`   - Trips: ${createdTrips.length}`);
        console.log('\n✨ You can now start using the application!\n');
        console.log('📧 Test Users:');
        console.log('   - john@example.com / password123');
        console.log('   - sarah@example.com / password123');
        console.log('   - mike@example.com / password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seeder
connectDB().then(() => {
    seedDatabase();
});
