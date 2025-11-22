import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  const lastUpdated = 'January 22, 2025';

  return (
    <>
      <Helmet>
        <title>Terms of Service | Kids Sports Zone</title>
        <meta
          name="description"
          content="Read our terms of service to understand the rules and guidelines for using Kids Sports Zone."
        />
      </Helmet>

      <div className="section-container py-12">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="font-display text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {lastUpdated}</p>

          <div className="bg-primary-50 border-l-4 border-primary-500 p-6 mb-8">
            <p className="text-gray-800 mb-0">
              <strong>Welcome to Kids Sports Zone!</strong> By accessing or using our website and services,
              you agree to be bound by these Terms of Service. Please read them carefully.
            </p>
          </div>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Kids Sports Zone ("the Platform", "our service", "we", "us"), you accept and
            agree to be bound by these Terms of Service and our <Link to="/privacy">Privacy Policy</Link>. If you
            do not agree to these terms, please do not use our service.
          </p>

          <h2>2. Description of Service</h2>
          <p>Kids Sports Zone is an online directory that:</p>
          <ul>
            <li>Helps parents find sports and activity venues for children aged 1-18</li>
            <li>Allows venue owners to list and promote their businesses</li>
            <li>Enables users to read and write reviews</li>
            <li>Provides search, filtering, and discovery features</li>
            <li>Facilitates connections between families and activity providers</li>
          </ul>

          <h2>3. User Accounts</h2>

          <h3>3.1 Account Types</h3>
          <p>We offer two account types:</p>
          <ul>
            <li><strong>Parent Accounts:</strong> For families searching for activities</li>
            <li><strong>Venue Owner Accounts:</strong> For businesses providing sports and activities</li>
          </ul>

          <h3>3.2 Account Registration</h3>
          <p>To use certain features, you must create an account. You agree to:</p>
          <ul>
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and update your information to keep it accurate</li>
            <li>Keep your password secure and confidential</li>
            <li>Be responsible for all activities under your account</li>
            <li>Notify us immediately of unauthorized account access</li>
          </ul>

          <h3>3.3 Age Requirements</h3>
          <p>
            You must be at least 18 years old to create an account. Our service is intended for parents and
            guardians, not for direct use by children.
          </p>

          <h2>4. Venue Listings</h2>

          <h3>4.1 Free Listings</h3>
          <p>
            Creating and claiming venue listings is free. Venue owners can provide business information, photos,
            contact details, and other relevant content.
          </p>

          <h3>4.2 Venue Ownership Verification</h3>
          <p>
            To claim a venue listing, you must verify that you are authorized to represent the business. False
            claims may result in account suspension or termination.
          </p>

          <h3>4.3 Listing Accuracy</h3>
          <p>Venue owners are responsible for:</p>
          <ul>
            <li>Maintaining accurate business information</li>
            <li>Updating hours, pricing, and contact details</li>
            <li>Ensuring photos accurately represent their venue</li>
            <li>Promptly correcting any inaccuracies</li>
          </ul>

          <h3>4.4 Paid Features</h3>
          <p>
            We may offer paid promotional features such as promoted listings and featured offers. Pricing and
            terms will be clearly communicated before purchase. All payments are non-refundable unless otherwise
            specified.
          </p>

          <h2>5. User Content</h2>

          <h3>5.1 Your Content</h3>
          <p>
            You retain ownership of content you submit (reviews, photos, business information). By posting content,
            you grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your
            content on our platform.
          </p>

          <h3>5.2 Content Standards</h3>
          <p>You agree not to post content that:</p>
          <ul>
            <li>Is false, misleading, or deceptive</li>
            <li>Is defamatory, abusive, or harassing</li>
            <li>Contains hate speech or discrimination</li>
            <li>Violates privacy rights or intellectual property</li>
            <li>Contains spam or commercial solicitations</li>
            <li>Includes personal information about children</li>
            <li>Contains malware or malicious code</li>
          </ul>

          <h3>5.3 Reviews and Ratings</h3>
          <p>Reviews must be:</p>
          <ul>
            <li>Based on genuine personal experience</li>
            <li>Honest and factual</li>
            <li>Respectful and constructive</li>
            <li>Free from conflicts of interest (e.g., competitors posting negative reviews)</li>
          </ul>

          <h3>5.4 Content Moderation</h3>
          <p>
            We reserve the right to review, edit, or remove any content that violates these terms or is otherwise
            objectionable. We may also suspend or terminate accounts that repeatedly violate our policies.
          </p>

          <h2>6. Prohibited Uses</h2>
          <p>You may not:</p>
          <ul>
            <li>Use the platform for illegal purposes</li>
            <li>Impersonate others or misrepresent affiliations</li>
            <li>Scrape, crawl, or data mine our site without permission</li>
            <li>Interfere with platform security or functionality</li>
            <li>Attempt to gain unauthorized access to systems</li>
            <li>Post fake reviews or manipulate ratings</li>
            <li>Use automated systems (bots) without authorization</li>
            <li>Harass other users or venue owners</li>
          </ul>

          <h2>7. Intellectual Property</h2>

          <h3>7.1 Our Content</h3>
          <p>
            All content on Kids Sports Zone (design, text, graphics, logos, software) is owned by us or our
            licensors and protected by copyright, trademark, and other intellectual property laws.
          </p>

          <h3>7.2 Limited License</h3>
          <p>
            We grant you a limited, non-exclusive, non-transferable license to access and use the platform for
            personal, non-commercial purposes. You may not reproduce, distribute, modify, or create derivative
            works without our permission.
          </p>

          <h2>8. Third-Party Links</h2>
          <p>
            Our platform may contain links to third-party websites (venue websites, social media). We are not
            responsible for the content, privacy practices, or terms of third-party sites. Use at your own risk.
          </p>

          <h2>9. Disclaimers</h2>

          <h3>9.1 Information Accuracy</h3>
          <p>
            While we strive for accuracy, venue information is provided by third parties. We do not guarantee the
            completeness, accuracy, or timeliness of listings. Always verify details directly with venues.
          </p>

          <h3>9.2 User-Generated Content</h3>
          <p>
            Reviews and ratings reflect individual opinions and experiences. We do not endorse or verify the
            accuracy of user-generated content.
          </p>

          <h3>9.3 No Warranties</h3>
          <p>
            Our platform is provided "as is" without warranties of any kind, express or implied, including warranties
            of merchantability, fitness for a particular purpose, or non-infringement.
          </p>

          <h2>10. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Kids Sports Zone and its affiliates, officers, employees, and
            agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages
            arising from your use of the platform.
          </p>

          <h2>11. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Kids Sports Zone from any claims, damages, losses, and expenses
            (including legal fees) arising from your use of the platform, your content, or your violation of these terms.
          </p>

          <h2>12. Termination</h2>
          <p>We may suspend or terminate your account at any time for:</p>
          <ul>
            <li>Violation of these Terms of Service</li>
            <li>Fraudulent or illegal activity</li>
            <li>Abuse of the platform or other users</li>
            <li>Extended inactivity</li>
          </ul>
          <p>
            You may terminate your account at any time by contacting us. Upon termination, your right to use the
            platform ceases immediately.
          </p>

          <h2>13. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. We'll notify users of significant
            changes via email or website notice. Continued use after changes constitutes acceptance of the new terms.
          </p>

          <h2>14. Governing Law</h2>
          <p>
            These Terms are governed by the laws of Australia. Any disputes shall be resolved in the courts of
            Australia.
          </p>

          <h2>15. Dispute Resolution</h2>
          <p>
            If you have a dispute with Kids Sports Zone, please contact us first to resolve informally. If we cannot
            reach a resolution, disputes may be submitted to mediation or arbitration before pursuing legal action.
          </p>

          <h2>16. Severability</h2>
          <p>
            If any provision of these Terms is found invalid or unenforceable, the remaining provisions remain in
            full force and effect.
          </p>

          <h2>17. Entire Agreement</h2>
          <p>
            These Terms of Service, together with our Privacy Policy, constitute the entire agreement between you
            and Kids Sports Zone regarding use of the platform.
          </p>

          <h2>18. Contact Information</h2>
          <p>For questions about these Terms of Service, contact us:</p>
          <ul>
            <li><strong>Email:</strong> hello@kidssportszone.com.au</li>
            <li><strong>Mail:</strong> Kids Sports Zone Legal Department, [Address]</li>
          </ul>

          <p className="text-sm text-gray-600 mt-12 p-4 bg-gray-50 rounded-lg">
            <strong>Note:</strong> These terms of service are a template and should be reviewed by a legal professional
            before publication. Ensure compliance with all applicable Australian laws and regulations, including the
            Australian Consumer Law and competition regulations.
          </p>
        </div>
      </div>
    </>
  );
}
