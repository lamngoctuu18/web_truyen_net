import { useHomeData } from '../../hooks/useApi';
import { ComicGrid } from '../../components/comic/ComicGrid';
import { HotComicsSection } from '../../components/comic/HotComicsSection';
import { Loading } from '../../components/common/Loading';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronRight
} from 'lucide-react';
import type { Comic } from '../../types/comic.types';

export function HomePage() {
  const { data, loading, error } = useHomeData();
  const navigate = useNavigate();

  const handleComicClick = (comic: Comic) => {
    navigate(`/comic/${comic.slug}`);
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <Loading size="lg" text="Đang tải dữ liệu trang chủ..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-8">
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
    <div className="min-h-screen relative">
      {/* Hot Comics Section */}
      {data?.popular && (
        <HotComicsSection comics={data.popular.data.items} />
      )}

      {/* Other Sections with minimal overlay */}
      <div className="relative w-full px-6 py-16 space-y-20">
        {/* Very light overlay for card readability only */}
        <div className="absolute inset-0 bg-white/10 dark:bg-gray-900/15"></div>
        
        <div className="relative z-10 space-y-20">
        {/* New Comics */}
        {data?.newest && (
          <section className="animate-slide-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-1.5 sm:w-2 h-10 sm:h-12 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                  <span className="inline-block animate-bounce-slow">✨</span> Truyện Mới
                </h2>
              </div>
              <Link 
                to="/search?status=new" 
                className="group px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
              >
                <span className="flex items-center gap-2">
                  Xem tất cả
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
            <ComicGrid
              comics={data.newest.data.items.slice(0, 12)}
              onComicClick={handleComicClick}
            />
          </section>
        )}

        {/* Completed Comics */}
        {data?.completed && (
          <section className="animate-slide-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-1.5 sm:w-2 h-10 sm:h-12 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                  <span className="inline-block">✅</span> Hoàn Thành
                </h2>
              </div>
              <Link 
                to="/search?status=completed" 
                className="group px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
              >
                <span className="flex items-center gap-2">
                  Xem tất cả
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
            <ComicGrid
              comics={data.completed.data.items.slice(0, 12)}
              onComicClick={handleComicClick}
            />
          </section>
        )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;