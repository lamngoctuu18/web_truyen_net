import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppProvider } from '../contexts/AppContext';
import Layout from './Layout';

// Pages
import HomePage from '../pages/Home';
import SearchPage from '../pages/Search';
import CategoriesPage from '../pages/Categories';
import CategoryPage from '../pages/Category';
import ComicDetailPage from '../pages/ComicDetail';
import { FavoritesPage } from '../pages/Favorites/FavoritesPage';
import { HistoryPage } from '../pages/History/HistoryPage';
import ReaderPage from '../pages/Reader';

function LayoutWrapper() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          {/* Routes with Layout */}
          <Route element={<LayoutWrapper />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/comic/:slug" element={<ComicDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/history" element={<HistoryPage />} />
            
            {/* 404 */}
            <Route path="*" element={
              <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  404 - Không tìm thấy trang
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.
                </p>
                <a href="/" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all">
                  Về trang chủ
                </a>
              </div>
            } />
          </Route>

          {/* Reader without Layout */}
          <Route path="/comic/:slug/chapter/:chapter" element={<ReaderPage />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default AppRouter;
