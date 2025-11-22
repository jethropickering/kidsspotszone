import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaEnvelope, FaQuestionCircle, FaBuilding, FaComments } from 'react-icons/fa';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Integrate with email service (e.g., SendGrid, AWS SES, or Supabase Edge Function)
    // For now, just simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <>
        <Helmet>
          <title>Thank You | Kids Sports Zone</title>
        </Helmet>

        <div className="section-container py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-display font-bold mb-4">Message Sent!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for contacting us. We'll get back to you within 1-2 business days.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="btn-secondary"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Contact Us | Kids Sports Zone</title>
        <meta
          name="description"
          content="Get in touch with the Kids Sports Zone team. We're here to help with questions, feedback, and support."
        />
      </Helmet>

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <div className="section-container py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-primary-50">
              We'd love to hear from you! Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </div>

      <div className="section-container py-12">
        <div className="max-w-5xl mx-auto">
          {/* Contact Options */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaQuestionCircle className="text-2xl text-primary-600" />
              </div>
              <h3 className="font-bold mb-2">General Inquiries</h3>
              <p className="text-sm text-gray-600">
                Questions about the platform, features, or how to use the site
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBuilding className="text-2xl text-secondary-600" />
              </div>
              <h3 className="font-bold mb-2">Venue Owners</h3>
              <p className="text-sm text-gray-600">
                Questions about listing your venue, managing your profile, or promotional options
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaComments className="text-2xl text-accent-600" />
              </div>
              <h3 className="font-bold mb-2">Feedback</h3>
              <p className="text-sm text-gray-600">
                Suggestions for improvements, bug reports, or general feedback
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-display font-bold mb-6">Send Us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="venue">Venue Owner Question</option>
                    <option value="technical">Technical Support</option>
                    <option value="feedback">Feedback or Suggestion</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Tell us how we can help..."
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {formData.message.length} / 1000 characters
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaEnvelope />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Additional Info */}
            <div>
              <h2 className="text-2xl font-display font-bold mb-6">Other Ways to Reach Us</h2>

              <div className="space-y-6">
                <div className="card">
                  <h3 className="font-bold mb-2">Email</h3>
                  <a
                    href="mailto:hello@kidssportszone.com.au"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    hello@kidssportszone.com.au
                  </a>
                  <p className="text-sm text-gray-600 mt-2">
                    We typically respond within 1-2 business days
                  </p>
                </div>

                <div className="card">
                  <h3 className="font-bold mb-2">For Venue Owners</h3>
                  <a
                    href="mailto:venues@kidssportszone.com.au"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    venues@kidssportszone.com.au
                  </a>
                  <p className="text-sm text-gray-600 mt-2">
                    Questions about listings, promotions, and partnerships
                  </p>
                </div>

                <div className="card">
                  <h3 className="font-bold mb-2">Business Hours</h3>
                  <p className="text-gray-700">Monday - Friday</p>
                  <p className="text-gray-700">9:00 AM - 5:00 PM AEST</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Messages received outside business hours will be responded to on the next business day
                  </p>
                </div>

                <div className="card bg-warm-50">
                  <h3 className="font-bold mb-2">Frequently Asked Questions</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Find answers to common questions about using Kids Sports Zone
                  </p>
                  <a href="#faq" className="text-primary-600 hover:text-primary-700 font-medium">
                    View FAQ →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="bg-warm-50 py-12">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <details className="card group">
                <summary className="font-bold cursor-pointer list-none flex items-center justify-between">
                  <span>How do I claim my venue listing?</span>
                  <span className="transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-600 mt-4">
                  Visit your venue's page and click the "Claim This Listing" button. You'll need to create
                  a venue owner account and verify your ownership. The process is free and typically takes
                  1-2 business days for approval.
                </p>
              </details>

              <details className="card group">
                <summary className="font-bold cursor-pointer list-none flex items-center justify-between">
                  <span>How much does it cost to list my venue?</span>
                  <span className="transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-600 mt-4">
                  Creating and claiming a venue listing is completely free! We offer optional paid features
                  like promoted listings and featured offers to help increase your visibility.
                </p>
              </details>

              <details className="card group">
                <summary className="font-bold cursor-pointer list-none flex items-center justify-between">
                  <span>How do I report incorrect venue information?</span>
                  <span className="transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-600 mt-4">
                  On each venue page, you'll find a "Report Outdated Info" button at the bottom. Click it
                  to submit corrections or updates. We review all reports within 24-48 hours.
                </p>
              </details>

              <details className="card group">
                <summary className="font-bold cursor-pointer list-none flex items-center justify-between">
                  <span>Can I add a new venue that's not listed?</span>
                  <span className="transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-600 mt-4">
                  Yes! Sign up for a venue owner account and you can add new venues directly. All new
                  listings are reviewed by our team before being published to ensure quality.
                </p>
              </details>

              <details className="card group">
                <summary className="font-bold cursor-pointer list-none flex items-center justify-between">
                  <span>How do reviews work?</span>
                  <span className="transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-600 mt-4">
                  Any parent with an account can write reviews. We moderate all reviews to ensure they're
                  genuine and helpful. Venue owners can respond to reviews to address concerns or thank
                  reviewers.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
