export interface Booking {
  id: string;
  rooftopId: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  rooftop: {
    title: string;
    city: string;
    pricePerHour: number;
    images: string[];
    owner: any; // You can define a more specific type if needed
  };
} 