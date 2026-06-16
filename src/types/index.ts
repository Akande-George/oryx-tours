export type TourCategory =
  | "Luxury"
  | "Adventure"
  | "Culture"
  | "Wellness"
  | "Sports"
  | "Medical";

export type Tour = {
  id: string;
  slug: string;
  title: string;
  location: string;
  region: string;
  durationDays: number;
  groupSize: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  priceFrom: number;
  rating: number;
  reviewsCount: number;
  category: TourCategory;
  description: string;
  videoUrl?: string;
  highlights: string[];
  includes: string[];
  gradient: string;
  gallery: string[];
  images: string[];
  tags: string[];
  operatorId: string;
};

export type Destination = {
  id: string;
  name: string;
  country: string;
  toursCount: number;
  gradient: string;
  blurb: string;
  images: string[];
  priceFrom: number;
  rating: number;
  tags: string[];
};

export type Operator = {
  id: string;
  name: string;
  rating: number;
  yearsActive: number;
  responseTime: string;
  languages: string[];
  topBadge: string;
};

export type FleetCategory = "Economy" | "Premium" | "VIP";

export type Vehicle = {
  id: string;
  name: string;
  fleetCategory: FleetCategory;
  capacity: number;
  luggage: string;
  priceFrom: number;
  halfDayPrice: number;
  fullDayPrice: number;
  extraHourPrice: number;
  transferPrice: number;
  features: string[];
  gradient: string;
  images: string[];
  operatorId: string;
};

export type ServiceType = "tour" | "airport" | "local" | "point-to-point";

export type DurationMode = "half-day" | "full-day" | "extra-hour";

export type AirportDirection = "pickup" | "dropoff";

export type BookingStatus = "Upcoming" | "Completed" | "Cancelled";

export type PaymentStatus = "pending" | "paid" | "failed";

export type Booking = {
  id: string;
  tourId: string;
  tourTitle: string;
  date: string;
  guests: number;
  status: BookingStatus;
  price: number;
  reference: string;
  gradient: string;
  customerId?: string;
  paymentId?: string;
  paymentStatus?: PaymentStatus;
  paidAmount?: number;
};

export type Review = {
  id: string;
  name: string;
  rating: number;
  date: string;
  content: string;
};
