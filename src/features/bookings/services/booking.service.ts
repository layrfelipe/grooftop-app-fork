import { api } from '../../../services/api';
import { Booking } from '../types/booking.types';

export const bookingService = {
  async getBookings(): Promise<Booking[]> {
    const response = await api.get<Booking[]>('/bookings');
    return response.data;
  }
}; 