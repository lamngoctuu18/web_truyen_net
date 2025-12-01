import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../hooks/useApi';
import { Loading } from '../../components/common/Loading';
import { BookOpen, TrendingUp } from 'lucide-react';
import type { Category } from '../../types/comic.types';

export function CategoriesPage() {
  const { data: categories, loading, error } = useCategories();
  const navigate = useNavigate();

  const handleCategoryClick = (category: Category) => {
    navigate(`/category/${category.slug}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="lg" text="Đang tải danh sách thể loại..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Không thể tải dữ liệu
          </h3>
          <p className="text-red-600 dark:text-red-300 text-sm">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent" style={{ lineHeight: '2' }}>
            Thể Loại Truyện
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" style={{ lineHeight: '2' }}>
          Khám phá hàng ngàn bộ truyện tranh thuộc {categories?.length || 0} thể loại khác nhau
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-slide-up">
        {categories?.map((category, index) => (
          <button
            key={category._id || category.id || index}
            onClick={() => handleCategoryClick(category)}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50"
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300"></div>
            
            {/* Icon */}
            <div className="relative flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                {category.name.charAt(0)}
              </div>
            </div>

            {/* Category Name */}
            <h3 className="relative text-center font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
              {category.name}
            </h3>

            {/* Trending Badge */}
            {index < 10 && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <TrendingUp className="w-3 h-3" />
                  Hot
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Stats Section */}
      {categories && categories.length > 0 && (
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border border-gray-200/50 dark:border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {categories.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                Thể loại
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                Bộ truyện
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                Mới
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                Cập nhật hàng ngày
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;
