// Supabase Edge Function for sending emails
// Deploy with: supabase functions deploy send-email

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Email service configuration
// You can use: SendGrid, Resend, AWS SES, or Mailgun
// For this example, we'll use Resend (modern, simple, great DX)

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface EmailRequest {
  type: 'contact' | 'newsletter' | 'venue_claim' | 'venue_approved' | 'venue_rejected' | 'welcome' | 'password_reset'
  to: string
  data: Record<string, any>
}

const FROM_EMAIL = 'Kids Sports Zone <hello@kidssportszone.com.au>'
const ADMIN_EMAIL = 'admin@kidssportszone.com.au'

serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const { type, to, data }: EmailRequest = await req.json()

    // Validate request
    if (!type || !to) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: type, to' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Build email based on type
    const email = await buildEmail(type, to, data)

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(email),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to send email')
    }

    // Log email to database
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    await supabase.from('email_logs').insert({
      type,
      recipient: to,
      subject: email.subject,
      status: 'sent',
      provider_id: result.id,
    })

    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Email error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

async function buildEmail(type: string, to: string, data: Record<string, any>) {
  switch (type) {
    case 'contact':
      return {
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        reply_to: data.email,
        subject: `Contact Form: ${data.subject}`,
        html: renderContactEmail(data),
      }

    case 'newsletter':
      return {
        from: FROM_EMAIL,
        to,
        subject: 'Welcome to Kids Sports Zone Newsletter!',
        html: renderNewsletterWelcome(data),
      }

    case 'venue_claim':
      return {
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New Venue Claim: ${data.venueName}`,
        html: renderVenueClaimNotification(data),
      }

    case 'venue_approved':
      return {
        from: FROM_EMAIL,
        to,
        subject: `Your venue "${data.venueName}" has been approved!`,
        html: renderVenueApproved(data),
      }

    case 'venue_rejected':
      return {
        from: FROM_EMAIL,
        to,
        subject: `Update on your venue submission: ${data.venueName}`,
        html: renderVenueRejected(data),
      }

    case 'welcome':
      return {
        from: FROM_EMAIL,
        to,
        subject: 'Welcome to Kids Sports Zone!',
        html: renderWelcomeEmail(data),
      }

    case 'password_reset':
      return {
        from: FROM_EMAIL,
        to,
        subject: 'Reset Your Password - Kids Sports Zone',
        html: renderPasswordReset(data),
      }

    default:
      throw new Error(`Unknown email type: ${type}`)
  }
}

// Email templates

function renderContactEmail(data: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
        .value { margin-top: 5px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">New Contact Form Submission</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">From</div>
            <div class="value">${data.name}</div>
          </div>
          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          <div class="field">
            <div class="label">Subject</div>
            <div class="value">${data.subject}</div>
          </div>
          <div class="field">
            <div class="label">Message</div>
            <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
          </div>
        </div>
        <div class="footer">
          <p>This message was sent via the Kids Sports Zone contact form</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function renderNewsletterWelcome(data: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 40px; border: 1px solid #e0e0e0; border-top: none; }
        .button { display: inline-block; background: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">Welcome to Kids Sports Zone!</h1>
        </div>
        <div class="content">
          <p>Hi there! 👋</p>
          <p>Thanks for subscribing to the Kids Sports Zone newsletter! You're now part of a growing community of Australian parents finding the best sports activities for their kids.</p>

          <p><strong>What to expect:</strong></p>
          <ul>
            <li>🎯 New venue highlights and featured activities</li>
            <li>💰 Exclusive offers and promotions</li>
            <li>📅 Upcoming events and holiday programs</li>
            <li>💡 Tips for choosing the right sports for your kids</li>
            <li>🏆 Success stories from the community</li>
          </ul>

          <p>In the meantime, explore hundreds of sports venues across Australia:</p>
          <a href="https://kidssportszone.com.au" class="button">Browse Venues</a>

          <p>Have questions? Just reply to this email - we'd love to hear from you!</p>

          <p>Cheers,<br><strong>The Kids Sports Zone Team</strong></p>
        </div>
        <div class="footer">
          <p>You're receiving this because you subscribed to Kids Sports Zone newsletter.</p>
          <p><a href="{{unsubscribe_url}}">Unsubscribe</a> | <a href="https://kidssportszone.com.au/privacy">Privacy Policy</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}

function renderVenueClaimNotification(data: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 30px; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #666; }
        .button { display: inline-block; background: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">New Venue Claim Request</h1>
        </div>
        <div class="content">
          <p>A new venue claim has been submitted and requires your review.</p>

          <div class="field">
            <span class="label">Venue:</span> ${data.venueName}
          </div>
          <div class="field">
            <span class="label">Claimed by:</span> ${data.userName} (${data.userEmail})
          </div>
          <div class="field">
            <span class="label">Message:</span><br>${data.message || 'No message provided'}
          </div>

          <a href="https://kidssportszone.com.au/admin/claims" class="button">Review Claim</a>
        </div>
      </div>
    </body>
    </html>
  `
}

function renderVenueApproved(data: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 40px; border: 1px solid #e0e0e0; border-top: none; }
        .button { display: inline-block; background: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 32px;">🎉 Congratulations!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">Your venue has been approved</p>
        </div>
        <div class="content">
          <p>Hi ${data.userName},</p>
          <p>Great news! Your venue <strong>"${data.venueName}"</strong> has been approved and is now live on Kids Sports Zone.</p>

          <p><strong>What's next?</strong></p>
          <ul>
            <li>✅ Your venue is now visible to thousands of parents</li>
            <li>📸 Add photos to increase engagement (venues with photos get 60% more clicks)</li>
            <li>📝 Keep your information up-to-date</li>
            <li>💬 Respond to reviews from parents</li>
            <li>🎁 Create special offers to attract new customers</li>
          </ul>

          <a href="https://kidssportszone.com.au/dashboard/venue" class="button">Manage Your Venue</a>

          <p>Need help getting started? Check out our <a href="https://kidssportszone.com.au/help/venue-owners">Venue Owner Guide</a> or reply to this email with any questions.</p>

          <p>We're excited to have you on board!</p>

          <p>Cheers,<br><strong>The Kids Sports Zone Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `
}

function renderVenueRejected(data: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #666; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 40px; border: 1px solid #e0e0e0; border-top: none; }
        .reason { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Update on Your Venue Submission</h1>
        </div>
        <div class="content">
          <p>Hi ${data.userName},</p>
          <p>Thank you for submitting <strong>"${data.venueName}"</strong> to Kids Sports Zone.</p>

          <p>Unfortunately, we're unable to approve your submission at this time.</p>

          <div class="reason">
            <strong>Reason:</strong><br>
            ${data.reason || 'The submission did not meet our current guidelines.'}
          </div>

          <p><strong>What you can do:</strong></p>
          <ul>
            <li>Review our <a href="https://kidssportszone.com.au/guidelines">submission guidelines</a></li>
            <li>Make the necessary changes</li>
            <li>Submit your venue again</li>
          </ul>

          <p>If you have questions or need clarification, please reply to this email. We're here to help!</p>

          <p>Best regards,<br><strong>The Kids Sports Zone Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `
}

function renderWelcomeEmail(data: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 40px; border: 1px solid #e0e0e0; border-top: none; }
        .button { display: inline-block; background: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 32px;">Welcome to Kids Sports Zone!</h1>
        </div>
        <div class="content">
          <p>Hi ${data.name || 'there'}! 👋</p>
          <p>Welcome to Kids Sports Zone - Australia's premier directory for kids' sports activities!</p>

          ${data.userType === 'parent' ? `
          <p><strong>As a parent, you can:</strong></p>
          <ul>
            <li>🔍 Search hundreds of sports venues across Australia</li>
            <li>⭐ Save your favorite venues</li>
            <li>📝 Write reviews to help other parents</li>
            <li>💰 Discover exclusive offers and deals</li>
            <li>📅 Stay updated on events and holiday programs</li>
          </ul>
          ` : data.userType === 'venue_owner' ? `
          <p><strong>As a venue owner, you can:</strong></p>
          <ul>
            <li>📍 Add and manage your venue listings</li>
            <li>📸 Upload photos and showcase your facilities</li>
            <li>💬 Respond to parent reviews</li>
            <li>🎁 Create special offers to attract customers</li>
            <li>📊 Track your venue's performance</li>
          </ul>
          ` : ''}

          <a href="https://kidssportszone.com.au/dashboard" class="button">Go to Dashboard</a>

          <p>Need help getting started? Check out our <a href="https://kidssportszone.com.au/help">Help Center</a> or reply to this email.</p>

          <p>Let's find the perfect sports activities for your kids!</p>

          <p>Cheers,<br><strong>The Kids Sports Zone Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `
}

function renderPasswordReset(data: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #666; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 40px; border: 1px solid #e0e0e0; border-top: none; }
        .button { display: inline-block; background: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        .notice { background: #f8f9fa; border-left: 4px solid #666; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Reset Your Password</h1>
        </div>
        <div class="content">
          <p>Hi there,</p>
          <p>We received a request to reset your password for your Kids Sports Zone account.</p>

          <p>Click the button below to create a new password:</p>
          <a href="${data.resetUrl}" class="button">Reset Password</a>

          <div class="notice">
            <strong>⏰ This link expires in 1 hour</strong><br>
            For security reasons, this password reset link will only work once and expires after 1 hour.
          </div>

          <p><strong>Didn't request this?</strong><br>
          If you didn't ask to reset your password, you can safely ignore this email. Your password will not be changed.</p>

          <p>Stay safe,<br><strong>The Kids Sports Zone Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `
}
