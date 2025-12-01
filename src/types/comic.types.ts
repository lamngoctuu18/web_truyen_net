// Comic related types
export interface Comic {
  _id: string;
  name: string;
  slug: string;
  origin_name: string[];
  status: 'ongoing' | 'completed' | 'coming_soon';
  thumb_url: string;
  author?: string[];
  category: Category[];
  updatedAt: string;
  content?: string;
  chapters?: ChapterServer[];
  chaptersLatest?: ChapterInfo[];
  sub_docquyen?: boolean;
}

export interface ChapterServer {
  server_name: string;
  server_data: ChapterInfo[];
}

export interface ChapterInfo {
  filename: string;
  chapter_name: string;
  chapter_title: string;
  chapter_path?: string;
  chapter_image?: string;
  chapter_api_data: string;
}

export interface Chapter {
  comic_name: string;
  chapter_name: string;
  chapter_title: string;
  chapter_path: string;
  images: ChapterImage[];
  domains: string[];
}

export interface ChapterImage {
  page: number;
  src: string;
  backup_url?: string;
}

export interface Category {
  _id: string;
  id?: string; // Keep for backwards compatibility
  name: string;
  slug: string;
  description?: string;
}

// API Response types
export interface ComicsResponse {
  status: 'success' | 'error';
  message?: string;
  data: {
    seoOnPage: {
      og_type: string;
      titleHead: string;
      descriptionHead: string;
      og_image: string[];
    };
    breadCrumb: BreadCrumb[];
    titlePage: string;
    items: Comic[];
    params: {
      pagination: {
        currentPage: number;
        totalItems: number;
        totalItemsPerPage: number;
        pageRanges: number;
      };
    };
  };
}

export interface ComicDetailResponse {
  status: 'success' | 'error';
  message?: string;
  data: {
    seoOnPage: {
      og_type: string;
      titleHead: string;
      descriptionHead: string;
      og_image: string[];
    };
    breadCrumb: BreadCrumb[];
    item: Comic;
  };
}

export interface ChapterResponse {
  status: 'success' | 'error';
  message?: string;
  data: {
    seoOnPage: {
      og_type: string;
      titleHead: string;
      descriptionHead: string;
      og_image: string[];
    };
    breadCrumb: BreadCrumb[];
    item: Chapter;
  };
}

export interface HomeResponse {
  status: 'success' | 'error';
  message?: string;
  data: {
    seoOnPage: {
      og_type: string;
      titleHead: string;
      descriptionHead: string;
      og_image: string[];
    };
    items: Comic[];
    params: {
      type_slug: string;
      filterCategory: string[];
      sortField: string;
      pagination: {
        currentPage: number;
        maxPage: number;
        totalItems: number;
        totalItemsPerPage: number;
      };
      itemsUpdateInDay: number;
    };
    type_list: string;
    APP_DOMAIN_FRONTEND: string;
    APP_DOMAIN_CDN_IMAGE: string;
  };
}

export interface BreadCrumb {
  name: string;
  slug?: string;
  isCurrent?: boolean;
}

export interface CategoriesResponse {
  status: 'success' | 'error';
  message?: string;
  data: {
    items: Category[];
  };
}

// Search types
export interface SearchParams {
  q?: string;
  category?: string;
  status?: 'ongoing' | 'completed' | 'all';
  page?: number;
}

export interface SearchResponse extends ComicsResponse {}