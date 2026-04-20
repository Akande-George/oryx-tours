export type TourCategory =
  | "Adventure"
  | "Luxury"
  | "Culture"
  | "Desert"
  | "City"
  | "Wellness"
  | "Wildlife";

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
  highlights: string[];
  includes: string[];
  gradient: string;
  gallery: string[];
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

export type Vehicle = {
  id: string;
  name: string;
  capacity: number;
  luggage: string;
  priceFrom: number;
  features: string[];
  gradient: string;
};

export type BookingStatus = "Upcoming" | "Completed" | "Cancelled";

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
};

export type Review = {
  id: string;
  name: string;
  rating: number;
  date: string;
  content: string;
};
