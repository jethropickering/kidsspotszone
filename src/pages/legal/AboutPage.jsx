import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaHeart, FaSearch, FaStar, FaUsers, FaShieldAlt, FaRocket } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us | Kids Sports Zone</title>
        <meta
          name="description"
          content="Learn about Kids Sports Zone - Australia's trusted directory helping families discover amazing sports and activities for children aged 1-18."
        />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <div className="section-container py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              About Kids Sports Zone
            </h1>
            <p className="text-xl text-primary-50">
              Helping Australian families discover amazing sports and activities for their children
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="section-container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <FaHeart className="text-5xl text-primary-500 mx-auto mb-4" />
            <h2 className="text-3xl font-display font-bold mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600">
              To make it easy for every Australian family to find the perfect sports and activities
              for their children, helping kids stay active, build confidence, and develop lifelong skills.
            </p>
          </div>

          <div className="prose prose-lg mx-auto">
            <h3>Why We Exist</h3>
            <p>
              Finding the right sports and activities for your kids shouldn't be hard. As parents ourselves,
              we know the challenges of discovering quality programs, comparing options, reading reviews,
              and making informed decisions about where to invest your time and money.
            </p>

            <p>
              That's why we created Kids Sports Zone - a comprehensive, easy-to-use directory that brings
              together all the information you need in one place. From swimming lessons to soccer clubs,
              dance studios to martial arts academies, we make it simple to explore options, read honest
              reviews from other parents, and find the perfect fit for your child.
            </p>

            <h3>Our Story</h3>
            <p>
              Kids Sports Zone was founded by Australian parents who saw a gap in the market for a dedicated
              platform focused exclusively on children's sports and activities. We noticed that parents were
              spending hours searching Google, scrolling through Facebook groups, and asking for recommendations
              just to find basic information about local activities.
            </p>

            <p>
              We knew there had to be a better way. So we built Kids Sports Zone to be the go-to resource
              for Australian families, combining comprehensive venue information, honest parent reviews,
              special offers, and powerful search tools all in one trusted platform.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-warm-50 py-16">
        <div className="section-container">
          <h2 className="section-title text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-3xl text-primary-600" />
              </div>
              <h3 className="text-xl font-display font-bold mb-2">Trust & Safety</h3>
              <p className="text-gray-600">
                We verify venue information and moderate reviews to ensure families can trust
                the information they find on our platform.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-3xl text-secondary-600" />
              </div>
              <h3 className="text-xl font-display font-bold mb-2">Community First</h3>
              <p className="text-gray-600">
                We're built by parents, for parents. Our community's feedback and reviews
                help other families make better decisions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRocket className="text-3xl text-accent-600" />
              </div>
              <h3 className="text-xl font-display font-bold mb-2">Always Improving</h3>
              <p className="text-gray-600">
                We're constantly adding new features and venues to make your search easier
                and more helpful.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="section-container py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title text-center mb-12">How It Works</h2>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <FaSearch className="text-primary-500" />
                  Search & Discover
                </h3>
                <p className="text-gray-600">
                  Use our powerful search filters to find activities by location, category, age range,
                  price, and more. Our "Near Me" feature shows you what's closest to home.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <FaStar className="text-primary-500" />
                  Compare & Review
                </h3>
                <p className="text-gray-600">
                  Read honest reviews from other parents, check ratings, compare facilities and pricing,
                  and see what special offers are available.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <FaHeart className="text-primary-500" />
                  Save & Connect
                </h3>
                <p className="text-gray-600">
                  Save your favorites, share with other parents, and connect directly with venues
                  to enroll your child.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-16">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-display font-bold mb-2">5,000+</div>
              <div className="text-primary-100">Venues Listed</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold mb-2">30+</div>
              <div className="text-primary-100">Activity Types</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold mb-2">50+</div>
              <div className="text-primary-100">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold mb-2">10,000+</div>
              <div className="text-primary-100">Parent Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* For Venue Owners */}
      <div className="section-container py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-4">For Venue Owners</h2>
          <p className="text-xl text-gray-600 mb-8">
            We're here to help sports and activity centers reach more families
          </p>

          <div className="prose prose-lg mx-auto text-left mb-8">
            <p>
              Kids Sports Zone is more than just a directory - it's a marketing platform that helps
              sports venues, activity centers, and coaches connect with local families actively searching
              for programs. Our free listing service lets you showcase your facilities, share your story,
              and build trust through reviews.
            </p>

            <p>
              For venues looking to increase visibility, our promoted listings and featured offers help
              you stand out from the competition and attract more enrollments.
            </p>
          </div>

          <Link to="/signup" className="btn-primary inline-block">
            List Your Venue Free
          </Link>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-warm-50 py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-display font-bold mb-4">Get in Touch</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Have questions, feedback, or suggestions? We'd love to hear from you!
          </p>
          <Link to="/contact" className="btn-secondary inline-block">
            Contact Us
          </Link>
        </div>
      </div>
    </>
  );
}
