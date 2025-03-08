import { api } from '../../../services/api';

export interface Review {
  id: string;
  userId: string;
  rooftopId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface CreateReviewDto {
  rooftopId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
}

// Store review data to access rooftopId
const reviewCache = new Map<string, Review>();

export const reviewService = {
  getReviewsByRooftopId: async (rooftopId: string): Promise<Review[]> => {
    const response = await api.get<Review[]>(`/rooftops/${rooftopId}/reviews`);
    
    // Cache reviews for later use
    response.data.forEach(review => {
      reviewCache.set(review.id, review);
    });
    
    return response.data;
  },

  getUserReviews: async (): Promise<Review[]> => {
    const response = await api.get<Review[]>('/users/me/reviews');
    
    // Cache reviews for later use
    response.data.forEach(review => {
      reviewCache.set(review.id, review);
    });
    
    return response.data;
  },

  getReview: async (id: string): Promise<Review> => {
    // Check if we have the review in cache
    const cachedReview = reviewCache.get(id);
    
    if (cachedReview) {
      const response = await api.get<Review>(`/rooftops/${cachedReview.rooftopId}/reviews/${id}`);
      const review = response.data;
      reviewCache.set(id, review);
      return review;
    }
    
    // If not in cache, we need to fetch user reviews to find it
    const userReviews = await reviewService.getUserReviews();
    const review = userReviews.find(r => r.id === id);
    
    if (!review) {
      throw new Error('Review not found');
    }
    
    return review;
  },

  createReview: async (data: CreateReviewDto): Promise<Review> => {
    const { rooftopId, ...reviewData } = data;
    try {
      // The API expects the rooftopId in both the URL and the request body
      const response = await api.post<Review>(`/rooftops/${rooftopId}/reviews`, {
        rooftopId,
        ...reviewData
      });
      
      // Cache the new review
      reviewCache.set(response.data.id, response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Error creating review:', error);
      
      // Extract the error message from the API response
      if (error.message && error.message.includes('You can only review rooftops after a confirmed booking')) {
        throw new Error('You can only review rooftops after a confirmed booking');
      }
      
      // Handle other potential error messages
      if (error.message) {
        throw new Error(error.message);
      }
      
      throw new Error('Failed to create review. Please try again later.');
    }
  },

  updateReview: async (id: string, data: UpdateReviewDto): Promise<Review> => {
    // Check if we have the review in cache
    const cachedReview = reviewCache.get(id);
    
    if (!cachedReview) {
      // If not in cache, fetch it first
      await reviewService.getReview(id);
      return reviewService.updateReview(id, data);
    }
    
    const response = await api.patch<Review>(`/rooftops/${cachedReview.rooftopId}/reviews/${id}`, data);
    
    // Update the cache
    reviewCache.set(id, response.data);
    
    return response.data;
  },

  deleteReview: async (id: string): Promise<void> => {
    // Check if we have the review in cache
    const cachedReview = reviewCache.get(id);
    
    if (!cachedReview) {
      // If not in cache, fetch it first
      await reviewService.getReview(id);
      return reviewService.deleteReview(id);
    }
    
    await api.delete(`/rooftops/${cachedReview.rooftopId}/reviews/${id}`);
    
    // Remove from cache
    reviewCache.delete(id);
  },
}; 