import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-primary-600 transition-colors"
      >
        <FiHome className="w-4 h-4" />
        <span>Home</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <FiChevronRight className="w-4 h-4 text-gray-400" />
          {item.url ? (
            <Link
              to={item.url}
              className="hover:text-primary-600 transition-colors"
            >
              {item.name}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.name}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
