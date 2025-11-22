import { Helmet } from 'react-helmet-async';

export default function PrivacyPage() {
  const lastUpdated = 'January 22, 2025';

  return (
    <>
      <Helmet>
        <title>Privacy Policy | Kids Sports Zone</title>
        <meta
          name="description"
          content="Read our privacy policy to understand how Kids Sports Zone collects, uses, and protects your personal information."
        />
      </Helmet>

      <div className="section-container py-12">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="font-display text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {lastUpdated}</p>

          <div className="bg-primary-50 border-l-4 border-primary-500 p-6 mb-8">
            <p className="text-gray-800 mb-0">
              <strong>Your privacy is important to us.</strong> This Privacy Policy explains how Kids Sports Zone
              collects, uses, shares, and protects your personal information when you use our website and services.
            </p>
          </div>

          <h2>1. Information We Collect</h2>

          <h3>1.1 Information You Provide</h3>
          <p>When you use Kids Sports Zone, you may provide us with:</p>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, password, and role (parent or venue owner)</li>
            <li><strong>Profile Information:</strong> Optional details about your children (ages only, no names)</li>
            <li><strong>Venue Information:</strong> Business details, contact information, photos, and descriptions</li>
            <li><strong>Reviews and Ratings:</strong> Comments, ratings, and feedback about venues</li>
            <li><strong>Communications:</strong> Messages sent through our contact form or support channels</li>
          </ul>

          <h3>1.2 Automatically Collected Information</h3>
          <p>We automatically collect certain information when you use our site:</p>
          <ul>
            <li><strong>Usage Data:</strong> Pages visited, features used, search queries, and interaction patterns</li>
            <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
            <li><strong>Location Data:</strong> Approximate location based on IP address (with your consent for precise location)</li>
            <li><strong>Cookies:</strong> Small data files stored on your device (see our Cookie Policy)</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li><strong>Provide Our Services:</strong> Enable search, venue listings, reviews, and account management</li>
            <li><strong>Improve Our Platform:</strong> Analyze usage patterns to enhance features and user experience</li>
            <li><strong>Communicate:</strong> Send service updates, respond to inquiries, and provide customer support</li>
            <li><strong>Personalize:</strong> Show relevant venues and recommendations based on your preferences and location</li>
            <li><strong>Marketing:</strong> Send newsletters and promotional offers (with your consent, opt-out anytime)</li>
            <li><strong>Safety and Security:</strong> Detect fraud, prevent abuse, and protect our users</li>
            <li><strong>Legal Compliance:</strong> Meet legal obligations and enforce our Terms of Service</li>
          </ul>

          <h2>3. Information Sharing</h2>

          <h3>3.1 Public Information</h3>
          <p>The following information is publicly visible:</p>
          <ul>
            <li>Venue listings and business information provided by venue owners</li>
            <li>Reviews, ratings, and usernames (display names only)</li>
            <li>Public profile information you choose to share</li>
          </ul>

          <h3>3.2 Third-Party Service Providers</h3>
          <p>We share information with trusted service providers who help us operate our platform:</p>
          <ul>
            <li><strong>Hosting Services:</strong> Supabase (database and authentication)</li>
            <li><strong>Analytics:</strong> Google Analytics (anonymized data only)</li>
            <li><strong>Email Services:</strong> For transactional and marketing emails</li>
            <li><strong>Payment Processors:</strong> Stripe (for paid features, if applicable)</li>
          </ul>
          <p>These providers are contractually obligated to protect your data and use it only for specified purposes.</p>

          <h3>3.3 Legal Requirements</h3>
          <p>We may disclose your information if required by law or to:</p>
          <ul>
            <li>Comply with legal processes or government requests</li>
            <li>Enforce our Terms of Service</li>
            <li>Protect the rights, property, or safety of Kids Sports Zone, our users, or the public</li>
          </ul>

          <h3>3.4 Business Transfers</h3>
          <p>
            If Kids Sports Zone is involved in a merger, acquisition, or sale of assets, your information may be
            transferred. We'll notify you before your information becomes subject to a different privacy policy.
          </p>

          <h2>4. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your information, including:
          </p>
          <ul>
            <li>Encryption of data in transit (SSL/TLS)</li>
            <li>Secure password hashing</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and authentication</li>
            <li>Secure database hosting with Supabase</li>
          </ul>
          <p>
            However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security
            but continually work to protect your data.
          </p>

          <h2>5. Your Privacy Rights</h2>

          <h3>5.1 Access and Update</h3>
          <p>You can access and update your account information anytime through your dashboard.</p>

          <h3>5.2 Delete Your Account</h3>
          <p>
            You can request account deletion by contacting us at hello@kidssportszone.com.au. We'll delete your
            data within 30 days, except where required by law or legitimate business purposes (e.g., published reviews
            may remain anonymized).
          </p>

          <h3>5.3 Marketing Communications</h3>
          <p>You can opt out of marketing emails by:</p>
          <ul>
            <li>Clicking "unsubscribe" in any marketing email</li>
            <li>Updating preferences in your account settings</li>
            <li>Contacting us directly</li>
          </ul>

          <h3>5.4 Cookie Preferences</h3>
          <p>
            You can manage cookie preferences through our cookie consent banner or your browser settings. Note that
            disabling certain cookies may limit site functionality.
          </p>

          <h3>5.5 Australian Privacy Principles (APPs)</h3>
          <p>
            As an Australian business, we comply with the Australian Privacy Principles under the Privacy Act 1988.
            You have the right to:
          </p>
          <ul>
            <li>Know what personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Complain about privacy breaches</li>
          </ul>

          <h2>6. Children's Privacy</h2>
          <p>
            Our service is designed for parents to find activities for their children, not for direct use by children.
            We do not knowingly collect personal information from children under 13. If you believe we've inadvertently
            collected such information, please contact us immediately.
          </p>

          <h2>7. International Users</h2>
          <p>
            Kids Sports Zone is based in Australia and primarily serves Australian users. If you access our site from
            outside Australia, your information may be transferred to and processed in Australia, where data protection
            laws may differ from your jurisdiction.
          </p>

          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy occasionally. We'll notify you of significant changes by:
          </p>
          <ul>
            <li>Posting a notice on our website</li>
            <li>Sending an email to registered users</li>
            <li>Updating the "Last updated" date at the top of this page</li>
          </ul>
          <p>Your continued use of our services after changes constitutes acceptance of the updated policy.</p>

          <h2>9. Contact Us</h2>
          <p>
            If you have questions, concerns, or requests regarding this Privacy Policy or your personal information,
            please contact us:
          </p>
          <ul>
            <li><strong>Email:</strong> hello@kidssportszone.com.au</li>
            <li><strong>Mail:</strong> Kids Sports Zone Privacy Officer, [Address]</li>
          </ul>
          <p>
            We aim to respond to all privacy inquiries within 30 days.
          </p>

          <h2>10. Cookies and Tracking</h2>

          <h3>10.1 Essential Cookies</h3>
          <p>Required for basic site functionality (authentication, security).</p>

          <h3>10.2 Analytics Cookies</h3>
          <p>Help us understand how users interact with our site to improve user experience.</p>

          <h3>10.3 Marketing Cookies</h3>
          <p>Used to show relevant ads and measure campaign effectiveness (with your consent).</p>

          <p className="text-sm text-gray-600 mt-12 p-4 bg-gray-50 rounded-lg">
            <strong>Note:</strong> This privacy policy is a template and should be reviewed by a legal professional
            before publication. Ensure compliance with all applicable laws including the Australian Privacy Act 1988,
            GDPR (if serving EU users), and other relevant privacy regulations.
          </p>
        </div>
      </div>
    </>
  );
}
