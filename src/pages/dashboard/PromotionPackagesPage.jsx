import { Helmet } from 'react-helmet-async';
import { FiZap, FiTrendingUp, FiStar, FiCheck, FiX } from 'react-icons/fi';

export default function PromotionPackagesPage() {
  const packages = [
    {
      name: 'Basic',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        { text: 'Basic venue listing', included: true },
        { text: 'Up to 5 photos', included: true },
        { text: 'Basic contact information', included: true },
        { text: 'Opening hours display', included: true },
        { text: 'Review management', included: true },
        { text: 'Featured placement', included: false },
        { text: 'Priority support', included: false },
        { text: 'Advanced analytics', included: false },
        { text: 'Social media promotion', included: false }
      ],
      cta: 'Current Plan',
      color: 'gray'
    },
    {
      name: 'Featured',
      price: '$49',
      period: 'per month',
      description: 'Get more visibility and bookings',
      popular: true,
      features: [
        { text: 'Everything in Basic', included: true },
        { text: 'Featured badge on listing', included: true },
        { text: 'Priority in search results', included: true },
        { text: 'Unlimited photos', included: true },
        { text: 'Special offers promotion', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Priority email support', included: true },
        { text: 'Social media promotion', included: false },
        { text: 'Custom branding', included: false }
      ],
      cta: 'Upgrade Now',
      color: 'primary'
    },
    {
      name: 'Premium',
      price: '$99',
      period: 'per month',
      description: 'Maximum exposure and growth',
      features: [
        { text: 'Everything in Featured', included: true },
        { text: 'Top placement guarantee', included: true },
        { text: 'Homepage feature rotation', included: true },
        { text: 'Social media promotion', included: true },
        { text: 'Custom branding options', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Monthly performance reports', included: true },
        { text: 'Early access to new features', included: true },
        { text: 'Featured in newsletter', included: true }
      ],
      cta: 'Contact Sales',
      color: 'accent'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Promotion Packages | Kids Sports Zone</title>
        <meta name="description" content="Promote your venue and reach more families" />
      </Helmet>

      <div className="bg-warm-50 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent-500 to-primary-500 text-white py-16">
          <div className="section-container text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Promote Your Venue
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Get featured placement and reach thousands of families searching for kids activities
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="section-container py-12">
          <h2 className="text-3xl font-display font-bold text-center mb-8">Why Promote?</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="card text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-display font-bold mb-2">Increase Visibility</h3>
              <p className="text-gray-600">
                Stand out in search results and get discovered by more families
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiZap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-display font-bold mb-2">Boost Bookings</h3>
              <p className="text-gray-600">
                Featured venues see an average of 3x more inquiries and bookings
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiStar className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-display font-bold mb-2">Build Trust</h3>
              <p className="text-gray-600">
                Featured badges and priority placement signal quality to parents
              </p>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`card relative ${
                  pkg.popular
                    ? 'border-2 border-primary-500 shadow-xl'
                    : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-display font-bold mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                  <div className="mb-1">
                    <span className="text-4xl font-display font-bold">{pkg.price}</span>
                    {pkg.period !== 'forever' && (
                      <span className="text-gray-600 text-sm ml-2">{pkg.period}</span>
                    )}
                  </div>
                  {pkg.period === 'forever' && (
                    <p className="text-sm text-gray-500">{pkg.period}</p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2">
                      {feature.included ? (
                        <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <FiX className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    pkg.color === 'primary'
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : pkg.color === 'accent'
                      ? 'bg-accent-500 text-white hover:bg-accent-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => {
                    if (pkg.name === 'Featured') {
                      alert('Payment integration coming soon! Contact support to upgrade.');
                    } else if (pkg.name === 'Premium') {
                      alert('Contact support at support@kidsspotszone.com.au for Premium packages.');
                    }
                  }}
                >
                  {pkg.cta}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mt-16">
            <h2 className="text-3xl font-display font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="card">
                <h3 className="font-semibold text-lg mb-2">How does featured placement work?</h3>
                <p className="text-gray-600">
                  Featured venues appear at the top of search results and category pages, with a special badge that catches parents' attention. You'll also be included in our promotional emails and social media posts.
                </p>
              </div>

              <div className="card">
                <h3 className="font-semibold text-lg mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-600">
                  Yes! All paid plans are month-to-month with no long-term commitment. You can upgrade, downgrade, or cancel at any time.
                </p>
              </div>

              <div className="card">
                <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept all major credit cards, debit cards, and bank transfers. Payment integration is currently being implemented - contact support to set up your promotion package.
                </p>
              </div>

              <div className="card">
                <h3 className="font-semibold text-lg mb-2">How quickly will I see results?</h3>
                <p className="text-gray-600">
                  Most venues see an increase in profile views and inquiries within 24-48 hours of upgrading to a featured plan. Results vary based on your location, category, and how well you've optimized your listing.
                </p>
              </div>

              <div className="card">
                <h3 className="font-semibold text-lg mb-2">Do you offer custom packages?</h3>
                <p className="text-gray-600">
                  Yes! If you have multiple venues or specific needs, we can create a custom package. Contact our sales team at sales@kidsspotszone.com.au to discuss your requirements.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="card bg-gradient-to-br from-primary-500 to-accent-500 text-white text-center mt-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-display font-bold mb-4">
              Ready to grow your business?
            </h2>
            <p className="text-white/90 text-lg mb-6">
              Join hundreds of venues reaching thousands of families every day
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => alert('Contact support to upgrade: support@kidsspotszone.com.au')}
              >
                Upgrade Now
              </button>
              <a
                href="mailto:support@kidsspotszone.com.au"
                className="bg-transparent border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
