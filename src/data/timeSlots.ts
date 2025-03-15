import type { TimeSlot } from '../types/booking';
import { supabase } from '../lib/supabase';
import { timeSlotCache } from '../lib/cache';

// Helper function to create time slots for a specific date
const createTimeSlotForDate = (
  id: string,
  routeId: string,
  date: Date,
  startHour: number,
  startMinute: number,
  durationMinutes: number,
  type: 'group' | 'private' | 'taxi',
  availableSeats: number,
  seasonalMultiplier: number
): TimeSlot => {
  const startTime = new Date(date);
  startTime.setHours(startHour, startMinute, 0, 0);
  
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + durationMinutes);

  return {
    id: `${id}-${startTime.toISOString()}`,
    routeId,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    type,
    availableSeats,
    seasonalMultiplier
  };
};

// Determine if a date is in high season (June 1 - September 1)
const isHighSeason = (date: Date) => {
  const month = date.getMonth() + 1; // JavaScript months are 0-based
  return month >= 6 && month <= 9;
};

// Check if a time slot overlaps with existing bookings
const isTimeSlotAvailable = async (
  startTime: string,
  endTime: string,
  routeId: string,
  type: 'group' | 'private' | 'taxi'
): Promise<boolean> => {
  try {
    // For taxi boats, we don't need to check other types
    if (type === 'taxi') {
      const { data: existingBookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('tour_type', 'taxi')
        .eq('route_id', routeId)
        .eq('booking_date', new Date(startTime).toISOString());

      if (error) throw error;
      return !existingBookings || existingBookings.length === 0;
    }

    // For group and private tours, check all non-taxi bookings as they use the same boats
    const { data: existingBookings, error } = await supabase
      .from('bookings')
      .select('*')
      .neq('tour_type', 'taxi')
      .eq('booking_date', new Date(startTime).toISOString());

    if (error) throw error;
    return !existingBookings || existingBookings.length === 0;
  } catch (error) {
    console.error('Error checking booking availability:', error);
    return false;
  }
};

// Generate time slots for a specific date
export const getTimeSlotsForDate = async (date: Date): Promise<TimeSlot[]> => {
  const seasonalMultiplier = isHighSeason(date) ? 0.8 : 1;
  const slots: TimeSlot[] = [];

  // Define all potential time slots
  const potentialSlots = [
    // Blue Lagoon Group Tours
    {
      id: 'blue-lagoon-morning-group',
      routeId: 'blue-lagoon-trogir',
      startHour: 9,
      startMinute: 0,
      duration: 300,
      type: 'group' as const,
      seats: 10
    },
    {
      id: 'blue-lagoon-afternoon-group',
      routeId: 'blue-lagoon-trogir',
      startHour: 14,
      startMinute: 0,
      duration: 300,
      type: 'group' as const,
      seats: 10
    },
    // Blue Cave Group Tour
    {
      id: 'blue-cave-group',
      routeId: 'blue-cave-vis',
      startHour: 7,
      startMinute: 0,
      duration: 660,
      type: 'group' as const,
      seats: 10
    },
    // Private Tours
    {
      id: 'blue-lagoon-morning-private',
      routeId: 'blue-lagoon-trogir',
      startHour: 9,
      startMinute: 0,
      duration: 300,
      type: 'private' as const,
      seats: 10
    },
    {
      id: 'blue-lagoon-afternoon-private',
      routeId: 'blue-lagoon-trogir',
      startHour: 14,
      startMinute: 0,
      duration: 300,
      type: 'private' as const,
      seats: 10
    },
    {
      id: 'blue-cave-private',
      routeId: 'blue-cave-vis',
      startHour: 7,
      startMinute: 0,
      duration: 660,
      type: 'private' as const,
      seats: 10
    },
    {
      id: 'swimming-horses-morning-private',
      routeId: 'swimming-horses-brac',
      startHour: 9,
      startMinute: 0,
      duration: 300,
      type: 'private' as const,
      seats: 10
    },
    {
      id: 'swimming-horses-afternoon-private',
      routeId: 'swimming-horses-brac',
      startHour: 14,
      startMinute: 0,
      duration: 300,
      type: 'private' as const,
      seats: 10
    },
    {
      id: 'hvar-blue-lagoon-private',
      routeId: 'hvar-blue-lagoon',
      startHour: 8,
      startMinute: 0,
      duration: 600,
      type: 'private' as const,
      seats: 10
    }
  ];

  // Check availability and add valid slots
  for (const slot of potentialSlots) {
    const timeSlot = createTimeSlotForDate(
      slot.id,
      slot.routeId,
      date,
      slot.startHour,
      slot.startMinute,
      slot.duration,
      slot.type,
      slot.seats,
      slot.type === 'private' ? seasonalMultiplier : 1
    );

    const isAvailable = await isTimeSlotAvailable(
      timeSlot.startTime,
      timeSlot.endTime,
      slot.routeId,
      slot.type
    );

    if (isAvailable) {
      slots.push(timeSlot);
    }
  }

  // Add taxi transfers (available every hour from 6 AM to 10 PM)
  for (let hour = 6; hour <= 22; hour++) {
    // Create potential taxi slots
    const airportSlot = createTimeSlotForDate(
      'split-airport-transfer',
      'split-airport-transfer',
      date,
      hour,
      0,
      15,
      'taxi',
      10,
      1
    );

    const trogirSlot = createTimeSlotForDate(
      'split-trogir-transfer',
      'split-trogir-transfer',
      date,
      hour,
      0,
      20,
      'taxi',
      10,
      1
    );

    // Check availability for each taxi slot
    const isAirportSlotAvailable = await isTimeSlotAvailable(
      airportSlot.startTime,
      airportSlot.endTime,
      'split-airport-transfer',
      'taxi'
    );

    const isTrogirSlotAvailable = await isTimeSlotAvailable(
      trogirSlot.startTime,
      trogirSlot.endTime,
      'split-trogir-transfer',
      'taxi'
    );

    if (isAirportSlotAvailable) slots.push(airportSlot);
    if (isTrogirSlotAvailable) slots.push(trogirSlot);
  }

  return slots;
};

export const getFilteredTimeSlots = async (
  date: Date,
  routeId: string,
  tourType: string
): Promise<TimeSlot[]> => {
  // Check cache first
  const cachedSlots = timeSlotCache.get(date, routeId, tourType);
  if (cachedSlots) {
    return cachedSlots;
  }

  // If not in cache, fetch and filter slots
  const allSlots = await getTimeSlotsForDate(date);
  const filteredSlots = allSlots.filter(
    slot => slot.routeId === routeId && slot.type === tourType
  );

  // Cache the results
  timeSlotCache.set(date, routeId, tourType, filteredSlots);

  return filteredSlots;
};