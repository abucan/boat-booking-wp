export type Language = 'en' | 'hr';

export type TourType = 'group' | 'private' | 'taxi';

export interface Route {
  id: string;
  nameEn: string;
  nameHr: string;
  descriptionEn: string;
  descriptionHr: string;
  duration: number; // in minutes
  capacity: number;
  basePrice: number;
  privateTourPrice?: number; // Optional price for private tours
  discountedPrivateTourPrice?: number;
  stops: string[];
}

export interface TimeSlot {
  id: string;
  routeId: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  type: TourType;
  availableSeats: number;
  seasonalMultiplier: number;
}

export interface BookingFormData {
  tourType: TourType;
  routeId: string;
  selectedDate: Date | null;
  timeSlotId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfPassengers: number;
}
