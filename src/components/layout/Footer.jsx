import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiMail } from 'react-icons/fi';
import NewsletterForm from '../common/NewsletterForm';
import { categories } from '../../data/categories';
import { states, getPopularCities } from '../../data/locations';

export default function Footer() {
  const popularCategories = categories.filter(c => c.popular);
  const popularCities = getPopularCities().slice(0, 8);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-primary-600">
        <div className="section-container py-12">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-display font-bold mb-4">
              Stay Updated on Kids Activities
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Get the latest offers, new venues, and activity ideas delivered to your inbox
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🏃</span>
              <h3 className="text-xl font-display font-bold text-white">
                Kids Sports Zone
              </h3>
            </div>
            <p className="text-sm mb-4">
              Australia's leading directory for kids sports and activities.
              Helping parents find the perfect activities for their children.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-accent-500 transition-colors"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-secondary-500 transition-colors"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Popular Activities */}
          <div>
            <h4 className="text-white font-display font-semibold mb-4">
              Popular Activities
            </h4>
            <ul className="space-y-2 text-sm">
              {popularCategories.map(category => (
                <li key={category.id}>
                  <Link
                    to={`/${category.slug}`}
                    className="hover:text-primary-400 transition-colors flex items-center gap-2"
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/search"
                  className="hover:text-primary-400 transition-colors font-semibold"
                >
                  View All Activities →
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Locations */}
          <div>
            <h4 className="text-white font-display font-semibold mb-4">
              Popular Locations
            </h4>
            <ul className="space-y-2 text-sm">
              {popularCities.map(city => (
                <li key={city.id}>
                  <Link
                    to={`/locations/${city.slug}`}
                    className="hover:text-primary-400 transition-colors"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-display font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-primary-400 transition-colors">
                  List Your Venue
                </Link>
              </li>
              <li>
                <Link to="/signin" className="hover:text-primary-400 transition-colors">
                  Venue Owner Login
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* SEO Links - States */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h4 className="text-white font-display font-semibold mb-4">
            Browse by State
          </h4>
          <div className="flex flex-wrap gap-4 text-sm">
            {states.map(state => (
              <Link
                key={state.id}
                to={`/locations/${state.slug}`}
                className="hover:text-primary-400 transition-colors"
              >
                {state.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="section-container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>
              © {currentYear} Kids Sports Zone. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="hover:text-primary-400 transition-colors">
                Privacy
              </Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-primary-400 transition-colors">
                Terms
              </Link>
              <span>•</span>
              <Link to="/contact" className="hover:text-primary-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
