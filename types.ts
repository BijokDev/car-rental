export enum CarCategory {
  ECONOMY = "Economy",
  SEDAN = "Sedan",
  MPV = "MPV",
  SUV = "SUV",
  LUXURY = "Luxury",
  VAN = "Van",
  BUS = "Bus",
}

export interface Car {
  id: string;
  name: string;
  category: CarCategory;
  pricePerDay: number; // Daily Rental
  priceTransfer: number; // KLIA Transfer approx
  seats: number;
  luggage?: string; // Luggage capacity description
  image: string;
  gallery: string[]; // New: Array of images for the gallery (Interior, Seats, etc.)
  features: string[];
}

export interface BookingDetails {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate?: string;
  returnTime?: string;
  tripType: "one-way" | "return";
  selectedCarId?: string;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  approved: boolean;
  createdAt?: any;
}

export interface Article {
  id?: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  excerpt: string;
  author: string;
  published: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface AppUser {
  id?: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isAdmin: boolean;
  lastSignIn: any;
  createdAt?: any;
}
