import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Star, TrendingUp, Zap, Eye, Heart } from 'lucide-react';
import { LazyImage } from '../../common/LazyImage';
import type { Comic } from '../../../types/comic.types';
import { useFavorites } from '../../../hooks/useFavorites';

interface HotComicsSectionProps {
  comics: Comic[];
}

export function HotComicsSection({ comics }: HotComicsSectionProps) {
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Epic timed card reveal animation
  useEffect(() => {
    const topComics = comics.slice(0, 6);
    
    topComics.forEach((_, index) => {
      setTimeout(() => {
        setRevealedCards(prev => [...prev, index]);
      }, index * 150); // Stagger animation by 150ms
    });
  }, [comics]);

  const handleComicClick = (slug: string) => {
    navigate(`/comic/${slug}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent, comic: Comic) => {
    e.stopPropagation();
    toggleFavorite(comic);
  };

  const topComics = comics.slice(0, 6);

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-pink-500/5 dark:from-orange-500/10 dark:via-red-500/10 dark:to-pink-500/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,100,50,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,50,100,0.1),transparent_50%)]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <Flame className="w-12 h-12 text-orange-500/20" />
      </div>
      <div className="absolute top-40 right-20 animate-float-delayed">
        <Star className="w-10 h-10 text-yellow-500/20" />
      </div>
      <div className="absolute bottom-20 left-1/4 animate-float">
        <Zap className="w-14 h-14 text-red-500/20" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 backdrop-blur-sm rounded-full border border-orange-500/20 mb-4">
            <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              Đang thịnh hành
            </span>
            <TrendingUp className="w-5 h-5 text-red-500" />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
              Truyện HOT
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Những bộ truyện đang được yêu thích nhất hiện nay
          </p>
        </div>

        {/* Epic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {topComics.map((comic, index) => (
            <div
              key={comic.slug}
              onClick={() => handleComicClick(comic.slug)}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`
                group relative cursor-pointer
                transform transition-all duration-700 ease-out
                ${revealedCards.includes(index)
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-20 scale-95'
                }
                ${hoveredCard === index ? 'scale-105 z-20' : 'scale-100'}
              `}
              style={{
                transitionDelay: revealedCards.includes(index) ? '0ms' : `${index * 150}ms`
              }}
            >
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-3xl opacity-0 group-hover:opacity-75 blur-xl transition-opacity duration-500"></div>
              
              {/* Card Container */}
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border-2 border-transparent group-hover:border-orange-500/50 transition-all duration-500">
                {/* Rank Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-full blur-md opacity-75"></div>
                    <div className="relative px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-full shadow-xl">
                      <span className="text-2xl font-black text-white">#{index + 1}</span>
                    </div>
                  </div>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={(e) => handleFavoriteClick(e, comic)}
                  className={`
                    absolute top-4 right-4 z-20 p-2.5 rounded-full shadow-lg
                    transition-all duration-300 hover:scale-110
                    ${isFavorite(comic.slug)
                      ? 'bg-gradient-to-r from-red-500 to-pink-500'
                      : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm'
                    }
                  `}
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
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                  
                  {/* Trending Indicator */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-50"></div>
                      <div className="relative p-6 bg-white/20 backdrop-blur-md rounded-full border-4 border-white/50">
                        <Flame className="w-12 h-12 text-white animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Stats Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    {comic.chaptersLatest && comic.chaptersLatest.length > 0 && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/90 backdrop-blur-sm rounded-full">
                        <Eye className="w-3.5 h-3.5 text-white" />
                        <span className="text-xs font-bold text-white">
                          Ch.{comic.chaptersLatest[0].chapter_name}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600/90 backdrop-blur-sm rounded-full">
                      <TrendingUp className="w-3.5 h-3.5 text-white" />
                      <span className="text-xs font-bold text-white">HOT</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-pink-600 transition-all duration-300 min-h-[3.5rem]">
                    {comic.name}
                  </h3>

                  {/* Categories */}
                  {comic.category && comic.category.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {comic.category.slice(0, 2).map((cat: any, catIndex: number) => (
                        <span
                          key={cat._id || cat.id || catIndex}
                          className="px-2.5 py-1 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 text-orange-700 dark:text-orange-400 text-xs font-semibold rounded-lg"
                        >
                          {cat.name}
                        </span>
                      ))}
                      {comic.category.length > 2 && (
                        <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-semibold rounded-lg">
                          +{comic.category.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Status */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      comic.status === 'completed'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {comic.status === 'completed' ? 'Hoàn thành' : 'Đang cập nhật'}
                    </span>

                    {/* Flame Counter */}
                    <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                      <Flame className="w-4 h-4 animate-pulse" />
                      <span className="text-sm font-bold">{1000 - index * 100}+</span>
                    </div>
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 animate-fade-in">
          <button
            onClick={() => navigate('/search?status=hot')}
            className="group relative px-10 py-4 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white font-bold text-lg rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-2">
              Xem tất cả truyện HOT
              <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default HotComicsSection;
