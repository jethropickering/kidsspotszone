import { supabase } from './supabase';

/**
 * Email Service - Client-side wrapper for Supabase Edge Function
 *
 * This service provides a clean interface for sending emails through
 * the Supabase Edge Function that handles email delivery.
 */

class EmailService {
  /**
   * Send contact form submission
   * @param {Object} data - Contact form data
   * @param {string} data.name - Sender name
   * @param {string} data.email - Sender email
   * @param {string} data.subject - Message subject
   * @param {string} data.message - Message content
   */
  async sendContactForm(data) {
    return this.sendEmail({
      type: 'contact',
      to: 'admin@kidssportszone.com.au', // Will be overridden in Edge Function
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      },
    });
  }

  /**
   * Send newsletter welcome email
   * @param {string} email - Subscriber email
   * @param {string} name - Subscriber name (optional)
   */
  async sendNewsletterWelcome(email, name = null) {
    return this.sendEmail({
      type: 'newsletter',
      to: email,
      data: {
        name,
      },
    });
  }

  /**
   * Send venue claim notification to admin
   * @param {Object} data - Claim data
   * @param {string} data.venueName - Venue name
   * @param {string} data.venueId - Venue ID
   * @param {string} data.userName - User name
   * @param {string} data.userEmail - User email
   * @param {string} data.message - Claim message
   */
  async sendVenueClaimNotification(data) {
    return this.sendEmail({
      type: 'venue_claim',
      to: 'admin@kidssportszone.com.au',
      data: {
        venueName: data.venueName,
        venueId: data.venueId,
        userName: data.userName,
        userEmail: data.userEmail,
        message: data.message,
      },
    });
  }

  /**
   * Send venue approval email to owner
   * @param {string} email - Owner email
   * @param {Object} data - Venue data
   * @param {string} data.venueName - Venue name
   * @param {string} data.userName - Owner name
   * @param {string} data.venueId - Venue ID
   */
  async sendVenueApproved(email, data) {
    return this.sendEmail({
      type: 'venue_approved',
      to: email,
      data: {
        venueName: data.venueName,
        userName: data.userName,
        venueId: data.venueId,
      },
    });
  }

  /**
   * Send venue rejection email to owner
   * @param {string} email - Owner email
   * @param {Object} data - Rejection data
   * @param {string} data.venueName - Venue name
   * @param {string} data.userName - Owner name
   * @param {string} data.reason - Rejection reason
   */
  async sendVenueRejected(email, data) {
    return this.sendEmail({
      type: 'venue_rejected',
      to: email,
      data: {
        venueName: data.venueName,
        userName: data.userName,
        reason: data.reason,
      },
    });
  }

  /**
   * Send welcome email to new user
   * @param {string} email - User email
   * @param {Object} data - User data
   * @param {string} data.name - User name
   * @param {string} data.userType - User type (parent, venue_owner, admin)
   */
  async sendWelcomeEmail(email, data) {
    return this.sendEmail({
      type: 'welcome',
      to: email,
      data: {
        name: data.name,
        userType: data.userType,
      },
    });
  }

  /**
   * Send password reset email (handled by Supabase Auth by default)
   * This is a wrapper in case you want custom emails
   * @param {string} email - User email
   * @param {string} resetUrl - Password reset URL
   */
  async sendPasswordReset(email, resetUrl) {
    return this.sendEmail({
      type: 'password_reset',
      to: email,
      data: {
        resetUrl,
      },
    });
  }

  /**
   * Core method to send email via Supabase Edge Function
   * @private
   */
  async sendEmail(payload) {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: payload,
      });

      if (error) {
        console.error('Email send error:', error);
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Email service error:', error);
      return { data: null, error };
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;
