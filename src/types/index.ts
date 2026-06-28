export type TourCategory = string;

export type Category = {
  id: string;
  title: string;
  description: string;
  order?: number;
};

export type ItineraryItem = {
  title: string;
  detail: string;
  duration?: string;
  admission?: string;
};

export type Tour = {
  id: string;
  slug: string;
  title: string;
  location: string;
  region: string;
  durationDays: number;
  // Optional free-text duration (e.g. "8 hours", "3 days, 2 nights"). When set
  // it is shown in place of the derived "{durationDays}-day" label.
  duration?: string;
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
  itinerary?: ItineraryItem[];
  reviews?: Review[];
  gradient: string;
  gallery: string[];
  images: string[];
  tags: string[];
  operatorId?: string | null;
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

export type FleetCategory = string;

export type FleetCategoryRecord = {
  id: string;
  title: string;
  description?: string;
  order?: number;
};

export type VehicleType =
  | "Sedan"
  | "SUV"
  | "Van"
  | "Coach"
  | "Pickup"
  | "Limousine"
  | "Crossover"
  | "Other";

export type Vehicle = {
  id: string;
  name: string;
  fleetCategory: FleetCategory;
  vehicleType?: VehicleType;
  capacity: number;
  luggage: string;
  priceFrom: number;
  halfDayPrice: number;
  fullDayPrice: number;
  extraHourPrice: number;
  transferPrice: number;
  pointToPointPrice: number;
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

export type PersonalizedRequestStatus = "new" | "contacted" | "closed";

export type PersonalizedRequest = {
  id: string;
  destination: string;
  startDate: string;
  endDate?: string;
  partySize: number;
  experiences: string[];
  budget: string;
  budgetAmount?: string;
  pace: string;
  lodging: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  status: PersonalizedRequestStatus;
  createdAt?: string;
};
