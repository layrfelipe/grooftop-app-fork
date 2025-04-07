export interface RooftopOwner {
  id: string;
  name: string;
  avatarUrl: string;
  createdAt: string;
}

export interface Rooftop {
  id: string;
  title: string;
  description: string;
  city: string;
  capacity: number;
  pricePerHour: number;
  images: string[];
  ownerId: string;
  owner: RooftopOwner;
  cancellationPolicyId: string | null;
  privacyPolicyId: string | null;
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