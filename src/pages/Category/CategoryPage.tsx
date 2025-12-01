import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useComicsByCategory } from '../../hooks/useApi';
import { ComicGrid } from '../../components/comic/ComicGrid';
import { Pagination } from '../../components/common/Pagination';
import { Filter, Grid, List, ChevronRight } from 'lucide-react';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data, loading, error } = useComicsByCategory(slug, currentPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to top when slug changes
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleComicClick = (comic: any) => {
    navigate(`/comic/${comic.slug}`);
  };

  const categoryName = data?.data?.titlePage || slug;
  const pagination = data?.data?.params?.pagination;
  
  // Calculate total pages from totalItems and totalItemsPerPage
  const totalPages = pagination 
    ? Math.ceil(pagination.totalItems / pagination.totalItemsPerPage)
    : 1;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 animate-fade-in">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Trang chủ
            </Link>
          </li>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <li>
            <Link to="/categories" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Thể loại
            </Link>
          </li>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <li className="text-gray-900 dark:text-white font-semibold">
            {categoryName}
          </li>
        </ol>
      </nav>

      {/* Category Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 animate-slide-up">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-10 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {categoryName}
            </h1>
          </div>
          {data?.data?.params?.pagination && (
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              <span className="font-semibold text-blue-600 dark:text-blue-400">{data.data.params.pagination.totalItems}</span> truyện
            </p>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-1.5 shadow-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Button */}
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-200">
            <Filter className="w-5 h-5" />
            <span>Bộ lọc</span>
          </button>
        </div>
      </div>

      {/* Comics Grid */}
      <ComicGrid
        comics={data?.data?.items || []}
        loading={loading}
        error={error}
        onComicClick={handleComicClick}
        className={viewMode === 'list' ? 'space-y-4' : ''}
        emptyMessage={`Không có truyện nào trong thể loại ${categoryName}`}
      />

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="mt-12 mb-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          
          {/* Page Info */}
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Trang <span className="font-semibold text-blue-600 dark:text-blue-400">{currentPage}</span> / <span className="font-semibold">{totalPages}</span>
            {pagination && (
              <span className="mx-2">•</span>
            )}
            {pagination && (
              <span>
                Hiển thị <span className="font-semibold">{pagination.totalItemsPerPage * (currentPage - 1) + 1}</span> - <span className="font-semibold">{Math.min(pagination.totalItemsPerPage * currentPage, pagination.totalItems)}</span> trong tổng số <span className="font-semibold text-blue-600 dark:text-blue-400">{pagination.totalItems}</span> truyện
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryPage;