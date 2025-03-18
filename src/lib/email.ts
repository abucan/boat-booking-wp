import emailjs from '@emailjs/browser';
import { routes } from '../data/routes';
import { format } from 'date-fns';
import type { Language } from '../types/booking';

interface SendBookingEmailsProps {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: Date;
  routeId: string;
  tourType: string;
  numberOfPassengers: number;
  timeSlotId: string;
  language: Language;
}

export async function sendBookingEmails({
  customerName,
  customerEmail,
  customerPhone,
  bookingDate,
  routeId,
  tourType,
  numberOfPassengers,
  timeSlotId,
  language,
}: SendBookingEmailsProps) {
  try {
    // Get route details
    const route = routes.find((r) => r.id === routeId);
    if (!route) throw new Error('Route not found');

    const routeName = language === 'en' ? route.nameEn : route.nameHr;

    // Calculate pricing
    let totalPrice: number;
    let pricePerPerson: number | null = null;

    if (tourType === 'group') {
      pricePerPerson = route.basePrice;
      totalPrice = route.basePrice * numberOfPassengers;
    } else if (tourType === 'taxi') {
      totalPrice = route.basePrice;
    } else {
      totalPrice = route?.discountedPrivateTourPrice || 0;
    }

    // Format date
    const formattedDate = format(bookingDate, 'dd.MM.yyyy.');

    // Generate a booking ID
    const bookingId = `BK-${Date.now().toString(36).toUpperCase()}`;

    // Format price strings
    const priceInfo =
      tourType === 'group'
        ? `Total Price: €${totalPrice} (€${pricePerPerson} per person)`
        : `Price: €${totalPrice}`;

    // Common email data
    const emailData = {
      booking_id: bookingId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      booking_date: formattedDate,
      route_name: routeName,
      tour_type: tourType.charAt(0).toUpperCase() + tourType.slice(1),
      number_of_passengers: numberOfPassengers,
      price_info: priceInfo,
      time_slot: timeSlotId, // Use the exact time slot string
      tour_duration: `${Math.floor(route.duration / 60)}h ${
        route.duration % 60
      }min`,
      tour_stops: route.stops.join(', '),
    };

    // Send email to admin
    await emailjs.send(
      'service_ii71uwq',
      'admin_template',
      {
        ...emailData,
        to_email: import.meta.env.VITE_ADMIN_EMAIL,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    // Send confirmation email to customer
    await emailjs.send(
      'service_ii71uwq',
      'customer_template',
      {
        ...emailData,
        to_email: customerEmail,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    return { success: true };
  } catch (error) {
    console.error('Error sending emails:', error);
    throw error;
  }
}
