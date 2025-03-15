import emailjs from '@emailjs/browser';

interface SendBookingEmailsProps {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  bookingDate: Date;
  routeId: string;
  tourType: string;
  numberOfPassengers: number;
  status: string;
}

export async function sendBookingEmails({
  bookingId,
  customerName,
  customerEmail,
  bookingDate,
  routeId,
  tourType,
  numberOfPassengers,
  status
}: SendBookingEmailsProps) {
  try {
    // Send email to admin
    await emailjs.send(
      'service_ii71uwq',  // Your EmailJS service ID
      'admin_template',   // Your EmailJS admin template ID
      {
        booking_id: bookingId,
        customer_name: customerName,
        customer_email: customerEmail,
        booking_date: bookingDate.toLocaleDateString(),
        route_id: routeId,
        tour_type: tourType,
        number_of_passengers: numberOfPassengers,
        status: status,
        to_email: import.meta.env.VITE_ADMIN_EMAIL
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY // Your EmailJS public key
    );

    // Send confirmation email to customer
    await emailjs.send(
      'service_ii71uwq',  // Your EmailJS service ID
      'customer_template', // Your EmailJS customer template ID
      {
        booking_id: bookingId,
        customer_name: customerName,
        customer_email: customerEmail,
        booking_date: bookingDate.toLocaleDateString(),
        route_id: routeId,
        tour_type: tourType,
        number_of_passengers: numberOfPassengers,
        to_email: customerEmail
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY // Your EmailJS public key
    );

    return { success: true };
  } catch (error) {
    console.error('Error sending emails:', error);
    throw error;
  }
}