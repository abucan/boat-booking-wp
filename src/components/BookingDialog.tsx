import React, { useState, useEffect } from 'react';
import { X, Anchor, Navigation, CarTaxiFront, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { hr, enUS } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";
import { Language, TourType, BookingFormData, TimeSlot } from '../types/booking';
import { translations } from '../i18n/translations';
import { routes } from '../data/routes';
import { getFilteredTimeSlots } from '../data/timeSlots';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { sendBookingEmails } from '../lib/email';

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export function BookingDialog({ isOpen, onClose, language }: BookingDialogProps) {
  const [formData, setFormData] = useState<Partial<BookingFormData>>({
    numberOfPassengers: 1,
    selectedDate: new Date()
  });
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  const t = translations[language];

  useEffect(() => {
    if (formData.routeId && formData.selectedDate && formData.tourType) {
      loadTimeSlots();
    }
  }, [formData.routeId, formData.selectedDate, formData.tourType]);

  const loadTimeSlots = async () => {
    if (!formData.routeId || !formData.selectedDate || !formData.tourType) return;
    
    setIsLoadingTimeSlots(true);
    try {
      const slots = await getFilteredTimeSlots(
        formData.selectedDate,
        formData.routeId,
        formData.tourType
      );
      setAvailableTimeSlots(slots);
    } catch (error) {
      console.error('Error loading time slots:', error);
      toast.error(
        language === 'en'
          ? 'Failed to load available time slots'
          : 'Greška pri učitavanju dostupnih termina'
      );
    } finally {
      setIsLoadingTimeSlots(false);
    }
  };

  if (!isOpen) return null;

  const handleTourTypeSelect = (type: TourType) => {
    setFormData({ ...formData, tourType: type });
    setStep(2);
  };

  const getAvailableRoutes = () => {
    if (!formData.tourType) return [];
    
    switch (formData.tourType) {
      case 'group':
        return routes.filter(route => 
          route.id === 'blue-lagoon-trogir' || 
          route.id === 'blue-cave-vis'
        );
      case 'private':
        return routes.filter(route => 
          route.id === 'blue-lagoon-trogir' || 
          route.id === 'blue-cave-vis' ||
          route.id === 'swimming-horses-brac' ||
          route.id === 'hvar-blue-lagoon'
        );
      case 'taxi':
        return routes.filter(route => route.id.includes('transfer'));
      default:
        return [];
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString(language === 'en' ? 'en-US' : 'hr-HR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTourTypeIcon = (type: TourType) => {
    switch (type) {
      case 'group':
        return <Anchor className="w-12 h-12 mb-2 text-blue-600" />;
      case 'private':
        return <Navigation className="w-12 h-12 mb-2 text-blue-600" />;
      case 'taxi':
        return <CarTaxiFront className="w-12 h-12 mb-2 text-blue-600" />;
    }
  };

  const handleRouteSelect = (routeId: string) => {
    setFormData({ ...formData, routeId });
    setStep(3);
  };

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      setFormData({ ...formData, selectedDate: date, timeSlotId: undefined });
    }
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setFormData({ ...formData, timeSlotId: timeSlot.id });
    setStep(4);
  };

  const handleCustomerDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.timeSlotId || !formData.customerName || !formData.customerEmail || 
        !formData.customerPhone || !formData.numberOfPassengers || !formData.selectedDate ||
        !formData.tourType || !formData.routeId) {
      toast.error(language === 'en' ? 'Please fill in all fields' : 'Molimo ispunite sva polja');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.from('bookings').insert({
        time_slot_id: formData.timeSlotId,
        booking_date: formData.selectedDate.toISOString(),
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        number_of_passengers: formData.numberOfPassengers,
        route_id: formData.routeId,
        tour_type: formData.tourType,
        status: 'pending'
      }).select().single();

      if (error) throw error;

      await sendBookingEmails({
        bookingId: data.id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        bookingDate: formData.selectedDate,
        routeId: formData.routeId,
        tourType: formData.tourType,
        numberOfPassengers: formData.numberOfPassengers,
        status: 'pending'
      });

      toast.success(
        language === 'en' 
          ? 'Booking submitted successfully! Check your email for confirmation.' 
          : 'Rezervacija je uspješno poslana! Provjerite svoj email za potvrdu.'
      );
      onClose();
      setFormData({ numberOfPassengers: 1, selectedDate: new Date() });
      setStep(1);
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error(
        language === 'en'
          ? 'Failed to submit booking. Please try again.'
          : 'Greška pri slanju rezervacije. Molimo pokušajte ponovno.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTourTypeSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {(['group', 'private', 'taxi'] as TourType[]).map((type) => (
        <button
          key={type}
          onClick={() => handleTourTypeSelect(type)}
          className="flex flex-col items-center p-6 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          {getTourTypeIcon(type)}
          <h3 className="text-lg font-medium capitalize">{type}</h3>
        </button>
      ))}
    </div>
  );

  const renderRouteSelection = () => {
    const availableRoutes = getAvailableRoutes();
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableRoutes.map((route) => (
          <button
            key={route.id}
            onClick={() => handleRouteSelect(route.id)}
            className="flex flex-col p-6 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
          >
            <h3 className="text-lg font-medium mb-2">
              {language === 'en' ? route.nameEn : route.nameHr}
            </h3>
            <p className="text-gray-600 mb-4">
              {language === 'en' ? route.descriptionEn : route.descriptionHr}
            </p>
            <div className="mt-auto">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {Math.floor(route.duration / 60)}h {route.duration % 60}min
                </span>
                <span className="text-lg font-semibold">
                  {route.basePrice}€
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {route.stops.map((stop, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                  >
                    {stop}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };

  const renderDateAndTimeSelection = () => {
    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6);
    const dateLocale = language === 'en' ? enUS : hr;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 border rounded-lg bg-white shadow-sm">
          <h3 className="text-lg font-medium mb-4">{t.booking.selectDate}</h3>
          <DatePicker
            selected={formData.selectedDate}
            onChange={handleDateSelect}
            minDate={minDate}
            maxDate={maxDate}
            dateFormat="MMMM d, yyyy"
            inline
            locale={dateLocale}
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <div className="flex items-center justify-between px-2 py-2">
                <button
                  onClick={decreaseMonth}
                  disabled={prevMonthButtonDisabled}
                  type="button"
                  className={`p-1 rounded-full hover:bg-gray-100 ${
                    prevMonthButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <span className="text-lg font-semibold text-gray-900">
                  {format(date, 'MMMM yyyy', { locale: dateLocale })}
                </span>
                <button
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                  type="button"
                  className={`p-1 rounded-full hover:bg-gray-100 ${
                    nextMonthButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-4">{t.booking.selectTime}</h3>
          <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2">
            {isLoadingTimeSlots ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {language === 'en' 
                    ? 'Loading available time slots...' 
                    : 'Učitavanje dostupnih termina...'}
                </p>
              </div>
            ) : availableTimeSlots.length > 0 ? (
              availableTimeSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleTimeSlotSelect(slot)}
                  className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                    formData.timeSlotId === slot.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-lg">
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{slot.availableSeats} {t.booking.seatsAvailable}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-8 px-4 border rounded-lg bg-gray-50">
                <p className="text-gray-500">
                  {language === 'en' 
                    ? 'No available time slots for the selected date' 
                    : 'Nema dostupnih termina za odabrani datum'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCustomerDetailsForm = () => (
    <form onSubmit={handleCustomerDetailsSubmit} className="space-y-6">
      <div>
        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
          {t.booking.name}
        </label>
        <input
          type="text"
          id="customerName"
          required
          value={formData.customerName || ''}
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
          {t.booking.email}
        </label>
        <input
          type="email"
          id="customerEmail"
          required
          value={formData.customerEmail || ''}
          onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
          {t.booking.phone}
        </label>
        <input
          type="tel"
          id="customerPhone"
          required
          value={formData.customerPhone || ''}
          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="numberOfPassengers" className="block text-sm font-medium text-gray-700 mb-1">
          {t.booking.passengers}
        </label>
        <input
          type="number"
          id="numberOfPassengers"
          min="1"
          max="10"
          required
          value={formData.numberOfPassengers || 1}
          onChange={(e) => setFormData({ ...formData, numberOfPassengers: parseInt(e.target.value, 10) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
      >
        {isSubmitting ? (
          language === 'en' ? 'Submitting...' : 'Šaljem...'
        ) : (
          t.common.confirm
        )}
      </button>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold">
            {step === 1 && t.booking.selectTour}
            {step === 2 && t.booking.selectRoute}
            {step === 3 && `${t.booking.selectDate} & ${t.booking.selectTime}`}
            {step === 4 && t.booking.customerDetails}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && renderTourTypeSelection()}
          {step === 2 && renderRouteSelection()}
          {step === 3 && renderDateAndTimeSelection()}
          {step === 4 && renderCustomerDetailsForm()}
        </div>

        <div className="flex justify-between p-4 border-t sticky bottom-0 bg-white">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              {t.common.back}
            </button>
          )}
          {step < 4 && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              {t.common.cancel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}