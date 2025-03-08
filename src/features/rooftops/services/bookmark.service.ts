import { api } from '../../../services/api';
import { Rooftop } from '../types/rooftop.types';

export interface Bookmark {
  id: string;
  userId: string;
  rooftopId: string;
  createdAt: string;
  rooftop?: Rooftop;
}

export const bookmarkService = {
  getBookmarks: async (): Promise<Bookmark[]> => {
    const response = await api.get<Bookmark[]>('/bookmarks');
    return response.data;
  },

  addBookmark: async (rooftopId: string): Promise<Bookmark> => {
    const response = await api.post<Bookmark>('/bookmarks', { rooftopId });
    return response.data;
  },

  removeBookmark: async (bookmarkId: string): Promise<void> => {
    await api.delete(`/bookmarks/${bookmarkId}`);
  },

  // Helper method to check if a rooftop is bookmarked
  isRooftopBookmarked: async (rooftopId: string, bookmarks: Bookmark[]): Promise<boolean> => {
    return bookmarks.some(bookmark => bookmark.rooftopId === rooftopId);
  },

  // Helper method to find a bookmark by rooftop ID
  findBookmarkByRooftopId: (rooftopId: string, bookmarks: Bookmark[]): Bookmark | undefined => {
    return bookmarks.find(bookmark => bookmark.rooftopId === rooftopId);
  }
}; 