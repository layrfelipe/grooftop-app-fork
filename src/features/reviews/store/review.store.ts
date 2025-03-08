import { create } from 'zustand';
import { Review, CreateReviewDto, UpdateReviewDto, reviewService } from '../services/review.service';

interface ReviewState {
  reviews: Review[];
  userReviews: Review[];
  currentReview: Review | null;
  isLoading: boolean;
  error: string | null;
  
  // Fetch reviews for a specific rooftop
  fetchRooftopReviews: (rooftopId: string) => Promise<void>;
  
  // Fetch reviews created by the current user
  fetchUserReviews: () => Promise<void>;
  
  // Create a new review
  createReview: (data: CreateReviewDto) => Promise<Review>;
  
  // Update an existing review
  updateReview: (id: string, data: UpdateReviewDto) => Promise<Review>;
  
  // Delete a review
  deleteReview: (id: string) => Promise<void>;
  
  // Calculate average rating for a rooftop
  getAverageRating: () => number;
  
  // Clear reviews when navigating away
  clearReviews: () => void;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  userReviews: [],
  currentReview: null,
  isLoading: false,
  error: null,
  
  fetchRooftopReviews: async (rooftopId: string) => {
    try {
      set({ isLoading: true, error: null });
      const reviews = await reviewService.getReviewsByRooftopId(rooftopId);
      set({ reviews, isLoading: false });
    } catch (error: any) {
      console.error('Failed to fetch rooftop reviews:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchUserReviews: async () => {
    try {
      set({ isLoading: true, error: null });
      const userReviews = await reviewService.getUserReviews();
      set({ userReviews, isLoading: false });
    } catch (error: any) {
      console.error('Failed to fetch user reviews:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  createReview: async (data: CreateReviewDto) => {
    try {
      set({ isLoading: true, error: null });
      const newReview = await reviewService.createReview(data);
      
      set(state => ({
        reviews: [...state.reviews, newReview],
        userReviews: [...state.userReviews, newReview],
        currentReview: newReview,
        isLoading: false
      }));
      
      return newReview;
    } catch (error: any) {
      console.error('Failed to create review:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  updateReview: async (id: string, data: UpdateReviewDto) => {
    try {
      set({ isLoading: true, error: null });
      const updatedReview = await reviewService.updateReview(id, data);
      
      set(state => ({
        reviews: state.reviews.map(review => 
          review.id === id ? updatedReview : review
        ),
        userReviews: state.userReviews.map(review => 
          review.id === id ? updatedReview : review
        ),
        currentReview: updatedReview,
        isLoading: false
      }));
      
      return updatedReview;
    } catch (error: any) {
      console.error('Failed to update review:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  deleteReview: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await reviewService.deleteReview(id);
      
      set(state => ({
        reviews: state.reviews.filter(review => review.id !== id),
        userReviews: state.userReviews.filter(review => review.id !== id),
        currentReview: state.currentReview?.id === id ? null : state.currentReview,
        isLoading: false
      }));
    } catch (error: any) {
      console.error('Failed to delete review:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  getAverageRating: () => {
    const { reviews } = get();
    if (reviews.length === 0) return 0;
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(1));
  },
  
  clearReviews: () => {
    set({ reviews: [], currentReview: null });
  }
})); 