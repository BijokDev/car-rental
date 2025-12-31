import { Car, CarCategory } from './types';

export const CAR_FLEET: Car[] = [
  {
    id: '1',
    name: 'Toyota Alphard',
    category: CarCategory.LUXURY,
    pricePerDay: 950,
    priceTransfer: 350,
    seats: 6,
    image: '/car-rental-images/5.png',
    gallery: [
      '/car-rental-images/5.png'
    ],
    features: ['VIP Captain Seats', 'Dual Power Doors', 'Premium Leather Interior', 'Privacy Glass'],
  },
  {
    id: '2',
    name: 'Hyundai Staria',
    category: CarCategory.MPV,
    pricePerDay: 850,
    priceTransfer: 300,
    seats: 7,
    image: '/car-rental-images/starianew.png',
    gallery: [
      '/car-rental-images/starianew.png'
    ],
    features: ['Futuristic Design', 'Huge Window Views', 'Premium Lounge Seats', 'Advanced Safety Tech'],
  },
  {
    id: '3',
    name: 'Toyota Innova',
    category: CarCategory.MPV,
    pricePerDay: 450,
    priceTransfer: 180,
    seats: 7,
    image: '/car-rental-images/4.png',
    gallery: [
      '/car-rental-images/4.png',
    ],
    features: ['Family Favorite', 'Robust Performance', 'Spacious Cargo Space', 'Excellent AC'],
  },
  {
    id: '4',
    name: 'Perodua Alza',
    category: CarCategory.MPV,
    pricePerDay: 250,
    priceTransfer: 130,
    seats: 7,
    image: '/car-rental-images/3.png',
    gallery: [
      '/car-rental-images/3.png',
    ],
    features: ['Compact MPV', 'Modern Multimedia', 'Versatile Seating', 'Fuel Efficient'],
  },
  {
    id: '5',
    name: 'Perodua Bezza',
    category: CarCategory.ECONOMY,
    pricePerDay: 150,
    priceTransfer: 90,
    seats: 4,
    image: '/car-rental-images/2.png',
    gallery: [
      '/car-rental-images/2.png',
    ],
    features: ['Best Economy Sedan', 'Huge Boot Space', 'Exceptional Fuel Economy', 'Smooth for City'],
  },
  {
    id: '6',
    name: 'Perodua Axia',
    category: CarCategory.ECONOMY,
    pricePerDay: 120,
    priceTransfer: 80,
    seats: 4,
    image: '/car-rental-images/1.png',
    gallery: [
      '/car-rental-images/1.png',
    ],
    features: ['Ultra Compact', 'Easy Parking', 'Very Economical', 'Agile Handling'],
  },
];

export const TESTIMONIALS = [
  {
    name: "Johnathan Tan",
    role: "Regular Customer",
    text: "AJ Taxi KL is my go-to for airport transfers. Always punctual and the cars are exceptionally clean. The Toyota Alphard is perfect for business trips.",
    rating: 5,
  },
  {
    name: "Aisyah Osman",
    role: "Family Traveler",
    text: "Booked a Toyota Innova for a trip to Genting. The driver was very careful and professional. Best service in Kuala Lumpur!",
    rating: 5,
  },
];
