import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { sendBookingEmails } from '../lib/email';
import { routes } from '../data/routes';
import { Check, X, Mail, RefreshCw } from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

interface Booking {
  id: string;
  time_slot_id: string;
  booking_date: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  number_of_passengers: number;
  status: BookingStatus;
  route_id: string;
  tour_type: string;
  created_at: string;
}

export function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadBookings();
    }
  }, [isOpen, filter]);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('bookings')
        .select('*')
        .order('booking_date', { ascending: true });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setBookings(data as Booking[]);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      const updatedBooking = bookings.find(b => b.id === bookingId);
      if (updatedBooking) {
        await sendBookingEmails({
          bookingId: updatedBooking.id,
          customerName: updatedBooking.customer_name,
          customerEmail: updatedBooking.customer_email,
          bookingDate: new Date(updatedBooking.booking_date),
          routeId: updatedBooking.route_id,
          tourType: updatedBooking.tour_type,
          numberOfPassengers: updatedBooking.number_of_passengers,
          status
        });
      }

      toast.success('Booking status updated successfully');
      loadBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking status');
    }
  };

  const sendCustomEmail = async (booking: Booking) => {
    setIsSendingEmail(true);
    try {
      await sendBookingEmails({
        bookingId: booking.id,
        customerName: booking.customer_name,
        customerEmail: booking.customer_email,
        bookingDate: new Date(booking.booking_date),
        routeId: booking.route_id,
        tourType: booking.tour_type,
        numberOfPassengers: booking.number_of_passengers,
        status: booking.status
      });
      toast.success('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const getRouteName = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    return route?.nameEn || routeId;
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Booking Management</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-md ${
                    filter === status
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={loadBookings}
              className="ml-auto flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-auto flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No bookings found</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {format(new Date(booking.booking_date), 'MMM d, yyyy')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(booking.booking_date), 'HH:mm')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.customer_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.customer_email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.customer_phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {getRouteName(booking.route_id)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Type: {booking.tour_type}
                      </div>
                      <div className="text-sm text-gray-500">
                        Passengers: {booking.number_of_passengers}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              className="text-green-600 hover:text-green-900"
                              title="Confirm booking"
                            >
                              <Check size={20} />
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                              className="text-red-600 hover:text-red-900"
                              title="Cancel booking"
                            >
                              <X size={20} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => sendCustomEmail(booking)}
                          disabled={isSendingEmail}
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                          title="Send email"
                        >
                          <Mail size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}