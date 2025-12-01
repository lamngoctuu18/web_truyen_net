import { useState, useEffect } from 'react';
import otruyenApi from '../services/otruyenApi';
import type { Comic, Category, ComicsResponse, ComicDetailResponse, ChapterResponse, SearchParams, HomeResponse } from '../types/comic.types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Generic hook for API calls with loading and error states
 */
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for fetching home page comics
 */
export function useHomeComics() {
  return useApi<HomeResponse>(
    () => otruyenApi.getHomeComics(),
    []
  );
}

/**
 * Hook for fetching comics by type
 * @param type - Type slug like 'truyen-moi', 'truyen-hot', 'hoan-thanh'
 * @param page - Page number
 */
export function useComicsByType(type: string, page: number = 1) {
  return useApi<ComicsResponse>(
    () => otruyenApi.getComicsByType(type, page),
    [type, page]
  );
}

/**
 * Hook for fetching popular comics
 */
export function usePopularComics(page: number = 1) {
  return useApi<ComicsResponse>(
    () => otruyenApi.getPopularComics(page),
    [page]
  );
}

/**
 * Hook for fetching new comics
 */
export function useNewComics(page: number = 1) {
  return useApi<ComicsResponse>(
    () => otruyenApi.getNewComics(page),
    [page]
  );
}

/**
 * Hook for fetching completed comics
 */
export function useCompletedComics(page: number = 1) {
  return useApi<ComicsResponse>(
    () => otruyenApi.getCompletedComics(page),
    [page]
  );
}

/**
 * Hook for fetching comic detail
 */
export function useComicDetail(slug: string | undefined) {
  return useApi<ComicDetailResponse>(
    () => otruyenApi.getComicDetail(slug!),
    [slug]
  );
}

/**
 * Hook for fetching chapter
 */
export function useChapter(comicSlug: string | undefined, chapterNumber: number | string | undefined) {
  return useApi<ChapterResponse>(
    () => otruyenApi.getChapter(comicSlug!, chapterNumber!),
    [comicSlug, chapterNumber]
  );
}

/**
 * Hook for searching comics with debounced input
 */
export function useSearchComics(searchParams: SearchParams, delay: number = 500) {
  const [debouncedParams, setDebouncedParams] = useState(searchParams);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedParams(searchParams);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchParams, delay]);

  return useApi<ComicsResponse>(
    () => otruyenApi.searchComics(debouncedParams),
    [debouncedParams]
  );
}

/**
 * Hook for fetching comics by category
 */
export function useComicsByCategory(categorySlug: string | undefined, page: number = 1) {
  return useApi<ComicsResponse>(
    () => otruyenApi.getComicsByCategory(categorySlug!, page),
    [categorySlug, page]
  );
}

/**
 * Hook for fetching all categories
 */
export function useCategories() {
  return useApi<Category[]>(
    () => otruyenApi.getCategories(),
    []
  );
}

/**
 * Hook for fetching home page data
 */
export function useHomeData() {
  return useApi(
    () => otruyenApi.getHomeData(),
    []
  );
}

/**
 * Hook for fetching search suggestions
 */
export function useSearchSuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await otruyenApi.getSearchSuggestions(query);
        setSuggestions(results);
      } catch (error) {
        console.warn('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return { suggestions, loading };
}