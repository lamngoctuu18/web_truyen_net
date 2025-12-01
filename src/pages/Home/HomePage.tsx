import { useState, useEffect } from 'react';
import { useHomeData } from '../../hooks/useApi';
import { ComicGrid } from '../../components/comic/ComicGrid';
import { Loading } from '../../components/common/Loading';
import { LazyImage } from '../../components/common/LazyImage';
import { useFavorites } from '../../hooks/useFavorites';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  TrendingUp, 
  Zap, 
  Heart, 
  ChevronLeft, 
  ChevronRight,
  Play,
  Sparkles
} from 'lucide-react';
import type { Comic } from '../../types/comic.types';

export function HomePage() {
  const { data, loading, error } = useHomeData();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // State for Epic Animations
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredCardMousePos, setHoveredCardMousePos] = useState({ x: 0, y: 0 });
  const [navigationRevealed, setNavigationRevealed] = useState(false);

  const handleComicClick = (comic: Comic) => {
    navigate(`/comic/${comic.slug}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent, comic: Comic) => {
    e.stopPropagation();
    toggleFavorite(comic);
  };

  // 3D Tilt effect handler
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const rotateY = (x / rect.width - 0.5) * 15; // Max 15deg rotation
    const rotateX = -(y / rect.height - 0.5) * 15; // Max 15deg rotation

    setHoveredCard(index);
    setHoveredCardMousePos({ x: rotateY, y: rotateX });
  };

  const handleCardMouseLeave = () => {
    setHoveredCard(null);
    setHoveredCardMousePos({ x: 0, y: 0 });
  };

  // Epic Timed Animation Sequence
  useEffect(() => {
    if (!data?.popular?.data?.items) return;

    const hotComics = data.popular.data.items.slice(0, 5);
    
    // Cards cascade reveal
    hotComics.forEach((_, index) => {
      setTimeout(() => {
        setRevealedCards(prev => [...prev, index]);
      }, 1500 + index * 200); // Start at 1.5s, stagger by 200ms
    });

    // Navigation reveal
    setTimeout(() => setNavigationRevealed(true), 3000);

    // Auto-slide micro motion
    const autoSlide = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % hotComics.length);
    }, 8000);

    return () => clearInterval(autoSlide);
  }, [data]);

  const nextSlide = () => {
    if (data?.popular?.data?.items) {
      setCurrentSlide(prev => (prev + 1) % data.popular.data.items.slice(0, 5).length);
    }
  };

  const prevSlide = () => {
    if (data?.popular?.data?.items) {
      const length = data.popular.data.items.slice(0, 5).length;
      setCurrentSlide(prev => (prev - 1 + length) % length);
    }
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
    <div className="min-h-screen">
      {/* Epic Hero Section with Hot Comics Integration */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 animate-cinematic-bg">
          {/* Dynamic Gradient Background */}
          <div className="absolute inset-0 hero-bg-overlay animate-parallax-zoom"></div>
          
          {/* Animated Gradient Layers */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-purple-500/5 opacity-50"></div>
          
          {/* Floating Abstract Elements */}
          <div className="absolute top-20 left-10 animate-float">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          </div>
          <div className="absolute top-40 right-20 animate-float-delayed">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          </div>
          <div className="absolute bottom-32 left-1/4 animate-float">
            <div className="w-40 h-40 bg-gradient-to-br from-purple-500/15 to-red-500/15 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          </div>
          <div className="absolute top-1/3 right-1/3 animate-float-delayed">
            <div className="w-48 h-48 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-full blur-4xl"></div>
          </div>

          {/* Animated Icons */}
          <div className="absolute top-32 right-1/4 animate-float">
            <Sparkles className="w-8 h-8 text-yellow-400/40 drop-shadow-lg" />
          </div>
          <div className="absolute bottom-48 right-16 animate-float-delayed">
            <Zap className="w-10 h-10 text-orange-400/40 drop-shadow-lg" />
          </div>
          <div className="absolute top-2/3 left-20 animate-float">
            <Star className="w-6 h-6 text-purple-400/30 drop-shadow-lg" />
          </div>
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 w-full py-16 flex flex-col min-h-screen">
          {/* Header Section - Hidden */}
          <div className="text-center mb-16 flex-grow-0">
          </div>

          {/* Epic Cards Carousel */}
          {data?.popular && (
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-full">
                {/* Cards Container */}
                <div className="relative overflow-hidden rounded-3xl">
                  <div 
                    className="flex transition-transform duration-500 ease-out animate-micro-motion"
                    style={{
                      transform: `translateX(-${currentSlide * (100 / 3)}%)`
                    }}
                  >
                    {data.popular.data.items.slice(0, 5).map((comic, index) => (
                      <div
                        key={comic.slug}
                        className={`flex-shrink-0 w-1/3 px-4 transition-all duration-700 ${
                          revealedCards.includes(index)
                            ? 'animate-card-cascade'
                            : 'opacity-0 translate-y-20 scale-95'
                        }`}
                        style={{
                          animationDelay: `${index * 200}ms`
                        }}
                        onMouseMove={(e) => handleCardMouseMove(e, index)}
                        onMouseLeave={handleCardMouseLeave}
                      >
                        {/* Epic Card */}
                        <div 
                          onClick={() => handleComicClick(comic)}
                          className={`
                            group relative cursor-pointer
                            ${hoveredCard === index ? 'z-20' : 'z-10'}
                          `}
                          style={{
                            perspective: '1000px',
                            transformStyle: 'preserve-3d' as const,
                            transform: hoveredCard === index 
                              ? `rotateX(${hoveredCardMousePos.y}deg) rotateY(${hoveredCardMousePos.x}deg) translateZ(20px) scale(1.05)`
                              : 'rotateX(0) rotateY(0) translateZ(0) scale(1)',
                            transition: hoveredCard !== index ? 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'transform 0.05s linear'
                          }}
                        >
                          {/* Glow Effect - Enhanced */}
                          <div className={`absolute -inset-2 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-3xl opacity-0 group-hover:opacity-60 blur-3xl transition-all duration-500 ${
                            hoveredCard === index ? 'opacity-60' : ''
                          }`}></div>
                          
                          {/* Card Container - Enhanced Shadow */}
                          <div className={`relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 transition-all duration-500 ${
                            hoveredCard === index ? 'shadow-[0_40px_120px_-20px_rgba(249,115,22,0.4)]' : ''
                          }`}>
                            {/* Rank Badge */}
                            <div className="absolute top-6 left-6 z-20">
                              <div className="relative">
                                <div className={`absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur-lg transition-all duration-500 ${
                                  hoveredCard === index ? 'opacity-100' : 'opacity-75'
                                }`}></div>
                                <div className="relative px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl">
                                  <span className="text-xl font-black text-white">#{index + 1}</span>
                                </div>
                              </div>
                            </div>

                            {/* Favorite Button */}
                            <button
                              onClick={(e) => handleFavoriteClick(e, comic)}
                              className={`
                                absolute top-6 right-6 z-20 p-3 rounded-full transition-all duration-300 hover:scale-110 transform
                                ${isFavorite(comic.slug)
                                  ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-lg scale-100'
                                  : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md hover:bg-white/95'
                                }
                              `}
                              style={{
                                transform: hoveredCard === index ? 'scale(1.15)' : 'scale(1)',
                                transition: hoveredCard === index ? 'transform 0.3s ease-out' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                              }}
                            >
                              <Heart
                                className={`w-5 h-5 transition-all ${
                                  isFavorite(comic.slug)
                                    ? 'text-white fill-current'
                                    : 'text-gray-600 dark:text-gray-300'
                                }`}
                              />
                            </button>

                            {/* Image Container */}
                            <div className="relative aspect-[3/4] overflow-hidden">
                              <LazyImage
                                src={comic.thumb_url}
                                alt={comic.name}
                                className={`w-full h-full object-cover transition-transform duration-700 ${
                                  hoveredCard === index ? 'scale-110' : 'scale-100'
                                }`}
                              />
                              
                              {/* Overlay - Enhanced */}
                              <div className={`absolute inset-0 transition-all duration-500 ${
                                hoveredCard === index 
                                  ? 'bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90' 
                                  : 'bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60'
                              }`}></div>
                            </div>

                            {/* Content - Enhanced */}
                            <div className={`p-6 space-y-4 transition-all duration-500 ${
                              hoveredCard === index 
                                ? 'bg-gradient-to-t from-gray-900/80 to-gray-900/20 dark:from-gray-800/80 dark:to-gray-800/20' 
                                : ''
                            }`}>
                              <h3 className={`text-2xl font-bold line-clamp-2 transition-all duration-500 ${
                                hoveredCard === index
                                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-pink-400'
                                  : 'text-gray-900 dark:text-white'
                              }`}>
                                {comic.name}
                              </h3>

                              {/* Stats - Enhanced */}
                              <div className={`flex items-center justify-between transition-all duration-500 ${
                                hoveredCard === index ? 'opacity-100 translate-y-0' : 'opacity-75'
                              }`}>
                                <div className="flex items-center gap-2">
                                  <TrendingUp className={`w-5 h-5 transition-all duration-500 ${
                                    hoveredCard === index ? 'w-6 h-6 text-orange-400' : 'text-orange-500'
                                  }`} />
                                  <span className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                    {1000 - index * 150}+ lượt đọc
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span className={`font-semibold transition-all duration-500 ${
                                    hoveredCard === index 
                                      ? 'text-yellow-400 text-lg' 
                                      : 'text-gray-700 dark:text-gray-300'
                                  }`}>
                                    {(4.8 - index * 0.1).toFixed(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className={`absolute top-1/2 -translate-y-1/2 left-4 transition-all duration-500 ${
                  navigationRevealed ? 'animate-navigation-reveal' : 'opacity-0 scale-75'
                }`}>
                  <button
                    onClick={prevSlide}
                    className="group relative p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-2xl border-2 border-white/30 hover:border-orange-500/50 hover:scale-110 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all duration-300 overflow-hidden"
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700 rounded-full"></div>
                    <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-orange-600 group-hover:-translate-x-2 transition-all relative z-10" />
                  </button>
                </div>

                <div className={`absolute top-1/2 -translate-y-1/2 right-4 transition-all duration-500 ${
                  navigationRevealed ? 'animate-navigation-reveal' : 'opacity-0 scale-75'
                }`}>
                  <button
                    onClick={nextSlide}
                    className="group relative p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-2xl border-2 border-white/30 hover:border-orange-500/50 hover:scale-110 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all duration-300 overflow-hidden"
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700 rounded-full"></div>
                    <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-orange-600 group-hover:translate-x-2 transition-all relative z-10" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="text-center mt-16 transition-all duration-800 animate-hero-subtitle">
            <div className="flex flex-wrap gap-6 justify-center">
              <Link 
                to="/search" 
                className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  Khám phá ngay
                </span>
              </Link>
              <Link 
                to="/categories" 
                className="px-10 py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white font-bold text-lg rounded-2xl border-2 border-white/20 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Thể loại
              </Link>
            </div>
          </div>

          {/* Page Counter */}
          <div className={`absolute bottom-8 right-8 transition-all duration-1000 ${
            navigationRevealed ? 'animate-counter-reveal' : 'opacity-0 translate-x-12'
          }`}>
            <div className="text-right group">
              <div className="relative">
                {/* Background accent */}
                <div className="absolute -inset-6 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-transparent rounded-2xl blur-xl group-hover:from-orange-500/20 group-hover:via-red-500/20 transition-all duration-500"></div>
                
                {/* Counter content */}
                <div className="relative">
                  <div className="text-6xl font-black text-gray-200 dark:text-gray-800 transition-all duration-500 group-hover:text-orange-400/30 group-hover:scale-110 transform">
                    0{currentSlide + 1}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-600 font-semibold tracking-wider uppercase">
                    / 0{data?.popular ? Math.min(5, data.popular.data.items.length) : 5}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Sections */}
      <div className="w-full px-4 py-16 space-y-20">
        {/* New Comics */}
        {data?.newest && (
          <section className="animate-slide-up">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-2 h-12 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
                  ✨ Truyện Mới
                </h2>
              </div>
              <Link 
                to="/search?status=new" 
                className="group px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  Xem tất cả
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-2 h-12 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
                  ✅ Hoàn Thành
                </h2>
              </div>
              <Link 
                to="/search?status=completed" 
                className="group px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  Xem tất cả
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
  );
}

export default HomePage;