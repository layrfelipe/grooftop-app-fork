export interface Rooftop {
  id: string;
  title: string;
  description: string;
  city: string;
  capacity: number;
  pricePerHour: number;
  images: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRooftopDto {
  title: string;
  description: string;
  city: string;
  capacity: number;
  pricePerHour: number;
  images: string[];
}

export interface UpdateRooftopDto {
  title?: string;
  description?: string;
  city?: string;
  capacity?: number;
  pricePerHour?: number;
  images?: string[];
}

export interface RooftopFilters {
  city?: string;
  capacity?: number;
} 