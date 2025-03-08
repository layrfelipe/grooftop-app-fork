import { create } from 'zustand';
import { Bookmark, bookmarkService } from '../services/bookmark.service';

interface BookmarkState {
  bookmarks: Bookmark[];
  isLoading: boolean;
  error: string | null;
  fetchBookmarks: () => Promise<void>;
  addBookmark: (rooftopId: string) => Promise<void>;
  removeBookmark: (rooftopId: string) => Promise<void>;
  isBookmarked: (rooftopId: string) => boolean;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarks: [],
  isLoading: false,
  error: null,

  fetchBookmarks: async () => {
    try {
      set({ isLoading: true, error: null });
      const bookmarks = await bookmarkService.getBookmarks();
      set({ bookmarks, isLoading: false });
    } catch (error: any) {
      console.error('Failed to fetch bookmarks:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  addBookmark: async (rooftopId: string) => {
    try {
      set({ isLoading: true, error: null });
      const newBookmark = await bookmarkService.addBookmark(rooftopId);
      set(state => ({ 
        bookmarks: [...state.bookmarks, newBookmark],
        isLoading: false 
      }));
    } catch (error: any) {
      console.error('Failed to add bookmark:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  removeBookmark: async (rooftopId: string) => {
    try {
      const { bookmarks } = get();
      const bookmark = bookmarkService.findBookmarkByRooftopId(rooftopId, bookmarks);
      
      if (!bookmark) {
        throw new Error('Bookmark not found');
      }
      
      set({ isLoading: true, error: null });
      await bookmarkService.removeBookmark(bookmark.id);
      
      set(state => ({
        bookmarks: state.bookmarks.filter(b => b.id !== bookmark.id),
        isLoading: false
      }));
    } catch (error: any) {
      console.error('Failed to remove bookmark:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  isBookmarked: (rooftopId: string) => {
    const { bookmarks } = get();
    return bookmarks.some(bookmark => bookmark.rooftopId === rooftopId);
  }
})); 