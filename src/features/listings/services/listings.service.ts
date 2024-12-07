import { api } from '../../../services/api';

export interface Listing {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
}

export const listingsService = {
  getListings: () => api.get('/listings'),
  getListing: (id: string) => api.get(`/listings/${id}`),
  createListing: (data: Omit<Listing, 'id'>) => api.post('/listings', data),
}; 