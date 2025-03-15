import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL')

interface Booking {
  booking_id: string
  customer_name: string
  customer_email: string
  booking_date: string
  route_id: string
  tour_type: string
  number_of_passengers: number
  status: string
}

serve(async (req) => {
  try {
    const booking: Booking = await req.json()
    
    // Send email to admin
    const adminEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'booking@yourdomain.com',
        to: ADMIN_EMAIL,
        subject: `New Booking: ${booking.route_id}`,
        html: `
          <h2>New Booking Details</h2>
          <p><strong>Booking ID:</strong> ${booking.booking_id}</p>
          <p><strong>Customer:</strong> ${booking.customer_name}</p>
          <p><strong>Email:</strong> ${booking.customer_email}</p>
          <p><strong>Date:</strong> ${new Date(booking.booking_date).toLocaleDateString()}</p>
          <p><strong>Tour:</strong> ${booking.route_id}</p>
          <p><strong>Type:</strong> ${booking.tour_type}</p>
          <p><strong>Passengers:</strong> ${booking.number_of_passengers}</p>
          <p><strong>Status:</strong> ${booking.status}</p>
        `,
      }),
    })

    // Send confirmation email to customer
    const customerEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'booking@yourdomain.com',
        to: booking.customer_email,
        subject: 'Booking Confirmation',
        html: `
          <h2>Your Booking is Confirmed!</h2>
          <p>Dear ${booking.customer_name},</p>
          <p>Thank you for booking with us. Here are your booking details:</p>
          <p><strong>Booking ID:</strong> ${booking.booking_id}</p>
          <p><strong>Date:</strong> ${new Date(booking.booking_date).toLocaleDateString()}</p>
          <p><strong>Tour:</strong> ${booking.route_id}</p>
          <p><strong>Type:</strong> ${booking.tour_type}</p>
          <p><strong>Passengers:</strong> ${booking.number_of_passengers}</p>
          <p>We'll be in touch with more details soon.</p>
          <p>Best regards,<br>Your Tour Team</p>
        `,
      }),
    })

    return new Response(JSON.stringify({ message: 'Emails sent successfully' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})