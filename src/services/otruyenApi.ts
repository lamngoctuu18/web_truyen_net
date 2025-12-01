import apiService from './api';
import type { 
  Comic,
  Category,
  ComicsResponse,
  ComicDetailResponse,
  ChapterResponse,
  SearchParams,
  SearchResponse,
  HomeResponse,
  CategoriesResponse
} from '../types/comic.types';
import { API_ENDPOINTS } from '../utils/constants';

class OTruyenApiService {
  
  /**
   * Get home page comics (latest updates)
   */
  async getHomeComics(): Promise<HomeResponse> {
    return apiService.get<HomeResponse>(API_ENDPOINTS.HOME);
  }

  /**
   * Get comics by list type (generic method)
   * @param type - Type slug like 'truyen-moi', 'truyen-hot', 'hoan-thanh', etc.
   * @param page - Page number
   */
  async getComicsByType(type: string, page: number = 1): Promise<ComicsResponse> {
    return apiService.get<ComicsResponse>(`/danh-sach/${type}`, {
      params: { page }
    });
  }

  /**
   * Get popular/hot comics
   */
  async getPopularComics(page: number = 1): Promise<ComicsResponse> {
    return apiService.get<ComicsResponse>(API_ENDPOINTS.COMICS_HOT, {
      params: { page }
    });
  }

  /**
   * Get newest comics
   */
  async getNewComics(page: number = 1): Promise<ComicsResponse> {
    return apiService.get<ComicsResponse>(API_ENDPOINTS.COMICS_NEW, {
      params: { page }
    });
  }

  /**
   * Get completed comics
   */
  async getCompletedComics(page: number = 1): Promise<ComicsResponse> {
    return apiService.get<ComicsResponse>(API_ENDPOINTS.COMICS_COMPLETED, {
      params: { page }
    });
  }

  /**
   * Get comic details by slug
   */
  async getComicDetail(slug: string): Promise<ComicDetailResponse> {
    return apiService.get<ComicDetailResponse>(`${API_ENDPOINTS.COMIC_DETAIL}/${slug}`);
  }

  /**
   * Get chapter details
   */
  async getChapter(comicSlug: string, chapterNumber: number | string): Promise<ChapterResponse> {
    const endpoint = `/truyen-tranh/${comicSlug}/chuong-${chapterNumber}`;
    return apiService.get<ChapterResponse>(endpoint);
  }

  /**
   * Search comics
   */
  async searchComics(params: SearchParams): Promise<SearchResponse> {
    const searchParams: Record<string, string> = {};
    
    if (params.q) searchParams.q = params.q;
    if (params.category) searchParams.category = params.category;
    if (params.status) searchParams.status = params.status;
    if (params.page) searchParams.page = params.page.toString();

    return apiService.get<SearchResponse>(API_ENDPOINTS.SEARCH, {
      params: searchParams
    });
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await apiService.get<CategoriesResponse>(API_ENDPOINTS.CATEGORIES);
    return response.data.items;
  }

  /**
   * Get comics by category
   */
  async getComicsByCategory(categorySlug: string, page: number = 1): Promise<ComicsResponse> {
    return apiService.get<ComicsResponse>(`${API_ENDPOINTS.CATEGORIES}/${categorySlug}`, {
      params: { page }
    });
  }

  /**
   * Get home page data (featured comics, latest updates, etc.)
   */
  async getHomeData(): Promise<{
    popular: ComicsResponse;
    newest: ComicsResponse;
    completed: ComicsResponse;
  }> {
    const [popular, newest, completed] = await Promise.all([
      this.getPopularComics(1),
      this.getNewComics(1),
      this.getCompletedComics(1)
    ]);

    return { popular, newest, completed };
  }

  /**
   * Get comic suggestions (related comics)
   */
  async getSuggestions(comicSlug: string): Promise<Comic[]> {
    // This might not exist in the API, implement based on categories or other logic
    try {
      const comicDetail = await this.getComicDetail(comicSlug);
      if (comicDetail.data.item.category && comicDetail.data.item.category.length > 0) {
        const firstCategory = comicDetail.data.item.category[0];
        const related = await this.getComicsByCategory(firstCategory.slug, 1);
        // Filter out the current comic and return only first 6
        return related.data.items
          .filter(comic => comic.slug !== comicSlug)
          .slice(0, 6);
      }
      return [];
    } catch (error) {
      console.warn('Could not fetch suggestions:', error);
      return [];
    }
  }

  /**
   * Get trending/featured comics for homepage
   */
  async getTrendingComics(limit: number = 10): Promise<Comic[]> {
    try {
      const response = await this.getPopularComics(1);
      return response.data.items.slice(0, limit);
    } catch (error) {
      console.warn('Could not fetch trending comics:', error);
      return [];
    }
  }

  /**
   * Quick search with autocomplete suggestions
   */
  async getSearchSuggestions(query: string): Promise<Comic[]> {
    if (query.length < 2) return [];
    
    try {
      const response = await this.searchComics({ q: query, page: 1 });
      return response.data.items.slice(0, 5); // Return top 5 suggestions
    } catch (error) {
      console.warn('Could not fetch search suggestions:', error);
      return [];
    }
  }
}

export const otruyenApi = new OTruyenApiService();
export default otruyenApi;