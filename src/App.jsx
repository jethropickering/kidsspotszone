import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

// Layout
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/home/HomePage';
import SearchPage from './pages/search/SearchPage';
import VenuePage from './pages/venue/VenuePage';
import AddVenuePage from './pages/venue/AddVenuePage';
import CategoryPage from './pages/category/CategoryPage';
import CityPage from './pages/location/CityPage';
import StatePage from './pages/location/StatePage';

// Auth pages
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Dashboard pages
import DashboardLayout from './components/layout/DashboardLayout';
import ParentDashboard from './pages/dashboard/ParentDashboard';
import VenueOwnerDashboard from './pages/dashboard/VenueOwnerDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

// Legal pages
import PrivacyPage from './pages/legal/PrivacyPage';
import TermsPage from './pages/legal/TermsPage';
import ContactPage from './pages/legal/ContactPage';
import AboutPage from './pages/legal/AboutPage';

// Cookie consent
import CookieConsent from './components/common/CookieConsent';

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <HelmetProvider>
      <Router>
        <Routes>
          {/* Public routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="venue/:slug" element={<VenuePage />} />

            {/* Category routes */}
            <Route path=":category" element={<CategoryPage />} />
            <Route path=":state/:category" element={<CategoryPage />} />
            <Route path=":state/:city/:category" element={<CategoryPage />} />

            {/* Location routes */}
            <Route path="locations/:state" element={<StatePage />} />
            <Route path="locations/:state/:city" element={<CityPage />} />

            {/* Legal pages */}
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>

          {/* Auth routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<ParentDashboard />} />
            <Route path="venue" element={<VenueOwnerDashboard />} />
            <Route path="venue/add" element={<AddVenuePage />} />
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
        </Routes>

        {/* Cookie Consent Banner */}
        <CookieConsent />
      </Router>
    </HelmetProvider>
  );
}

export default App;
