# META API Integration Guide

This guide explains how to integrate and use the META (Facebook) APIs in the HardRock website.

## Table of Contents

1. [Overview](#overview)
2. [Features Implemented](#features-implemented)
3. [Setup Instructions](#setup-instructions)
4. [Facebook Pixel Configuration](#facebook-pixel-configuration)
5. [Marketing API Setup](#marketing-api-setup)
6. [Usage Examples](#usage-examples)
7. [Testing](#testing)

---

## Overview

The HardRock website integrates with META's APIs to provide:
- **Facebook Pixel**: Track conversions, page views, and user behavior for retargeting
- **Facebook Marketing API**: Programmatically manage ad campaigns, get insights, and create custom audiences

---

## Features Implemented

### 1. Facebook Pixel (Conversion Tracking)

**Location**: `resources/views/app.blade.php`

**What it does**:
- Tracks page views automatically on every page load
- Tracks "Lead" conversion events when users submit the contact form
- Enables retargeting and custom audience creation based on website visitors

**Events tracked**:
- `PageView` - Automatically tracked on all pages
- `Lead` - Tracked when contact form is successfully submitted (in `ContactUs.tsx`)

### 2. Facebook Marketing API Service

**Location**: `app/Services/FacebookMarketingService.php`

**What it does**:
- Retrieve ad account insights and performance metrics
- Get campaigns, ad sets, and ads
- Create and update campaigns programmatically
- Manage custom audiences for targeting
- Access detailed performance data (impressions, clicks, spend, conversions, etc.)

---

## Setup Instructions

### Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose "Business" as the app type
4. Fill in your app details:
   - App Name: "HardRock Marketing"
   - App Contact Email: your-email@hardrock-co.com
5. Click "Create App"

### Step 2: Add Marketing API Product

1. In your app dashboard, click "Add Product"
2. Find "Marketing API" and click "Set Up"
3. Configure the required permissions:
   - `ads_read`
   - `ads_management`
   - `business_management`

### Step 3: Set Up Facebook Pixel

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Click "Connect Data Sources" → "Web"
3. Select "Facebook Pixel" → "Connect"
4. Name your pixel: "HardRock Website Pixel"
5. Copy the Pixel ID (it will be a long number like `1234567890123456`)

### Step 4: Get Your Access Token

#### For Testing (Short-lived Token):
1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from the dropdown
3. Click "Generate Access Token"
4. Grant the required permissions: `ads_read`, `ads_management`, `business_management`
5. Copy the access token

#### For Production (Long-lived Token):
You need to exchange the short-lived token for a long-lived one that lasts 60 days:

```bash
curl -X GET "https://graph.facebook.com/v22.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN"
```

Or use a System User token (never expires) - recommended for production:
1. Go to [Business Settings](https://business.facebook.com/settings/)
2. Click "Users" → "System Users"
3. Click "Add" and create a new system user
4. Assign the ad account to the system user
5. Generate a new token with the required permissions

### Step 5: Get Your Ad Account ID

1. Go to [Facebook Ads Manager](https://business.facebook.com/adsmanager/)
2. Look at the URL - you'll see something like `act=1234567890`
3. The number after `act=` is your Ad Account ID (just the numbers, not including "act_")

### Step 6: Configure Environment Variables

Add these values to your `.env` file:

```env
# META/Facebook Integration
FACEBOOK_PIXEL_ID=1234567890123456
FACEBOOK_APP_ID=your_app_id_here
FACEBOOK_APP_SECRET=your_app_secret_here
FACEBOOK_ACCESS_TOKEN=your_access_token_here
FACEBOOK_AD_ACCOUNT_ID=1234567890
```

**Important**:
- Do NOT include "act_" prefix in the ad account ID
- Keep your access token and app secret secure - never commit them to git
- The `.env` file is already in `.gitignore`

---

## Facebook Pixel Configuration

### How It Works

The Facebook Pixel is automatically loaded on every page via `app.blade.php`. It will only activate if `FACEBOOK_PIXEL_ID` is set in your environment variables.

### Custom Events

The contact form submission triggers a "Lead" event with the following data:

```javascript
fbq('track', 'Lead', {
    content_name: 'Contact Form Submission',
    content_category: 'Lead Generation',
    value: data.services.length,  // Number of services selected
    currency: 'USD'
});
```

### Verify Pixel Installation

1. Install [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/) Chrome extension
2. Visit your website
3. Click the extension icon - it should show your Pixel ID and events being tracked
4. Submit the contact form and verify the "Lead" event fires

---

## Marketing API Setup

### Using the Service Class

The `FacebookMarketingService` provides methods to interact with the Marketing API.

#### Example: Get Ad Account Insights

```php
use App\Services\FacebookMarketingService;

$facebookService = new FacebookMarketingService();

// Get last 30 days of performance data
$insights = $facebookService->getAdAccountInsights();

if ($insights) {
    foreach ($insights['data'] as $insight) {
        echo "Impressions: " . $insight['impressions'] . "\n";
        echo "Clicks: " . $insight['clicks'] . "\n";
        echo "Spend: $" . $insight['spend'] . "\n";
        echo "CTR: " . $insight['ctr'] . "%\n";
    }
}
```

#### Example: Get All Campaigns

```php
$campaigns = $facebookService->getCampaigns();

if ($campaigns) {
    foreach ($campaigns['data'] as $campaign) {
        echo "Campaign: " . $campaign['name'] . "\n";
        echo "Status: " . $campaign['status'] . "\n";
        echo "Objective: " . $campaign['objective'] . "\n";
    }
}
```

#### Example: Create a New Campaign

```php
$newCampaign = $facebookService->createCampaign(
    name: 'Q1 2025 Lead Generation',
    objective: 'OUTCOME_LEADS',  // Other options: OUTCOME_SALES, OUTCOME_AWARENESS, OUTCOME_ENGAGEMENT, OUTCOME_TRAFFIC
    status: 'PAUSED',  // Start paused, activate manually
    additionalParams: [
        'special_ad_categories' => []
    ]
);

if ($newCampaign) {
    echo "Campaign created with ID: " . $newCampaign['id'];
}
```

#### Example: Get Campaign Performance

```php
$campaignId = '123456789';
$insights = $facebookService->getCampaignInsights($campaignId);

if ($insights) {
    $data = $insights['data'][0];
    echo "Campaign Performance:\n";
    echo "Spend: $" . $data['spend'] . "\n";
    echo "Conversions: " . $data['conversions'] . "\n";
    echo "Cost per Conversion: $" . $data['cost_per_conversion'] . "\n";
}
```

#### Example: Create Custom Audience from Website Visitors

```php
// Create an audience of people who visited the contact page
$audience = $facebookService->createCustomAudience(
    name: 'Contact Page Visitors - Last 30 Days',
    description: 'People who visited the contact us page',
    rule: [
        'url' => [
            'i_contains' => 'contact'
        ]
    ]
);

if ($audience) {
    echo "Custom audience created with ID: " . $audience['id'];
}
```

---

## Usage Examples

### Building a Campaign Dashboard

You can create an admin dashboard to view campaign performance:

```php
// In a controller
public function dashboard()
{
    $facebookService = new FacebookMarketingService();

    // Get overall account performance
    $accountInsights = $facebookService->getAdAccountInsights();

    // Get all campaigns
    $campaigns = $facebookService->getCampaigns();

    // Get custom audiences for targeting
    $audiences = $facebookService->getCustomAudiences();

    return view('admin.campaigns', [
        'insights' => $accountInsights,
        'campaigns' => $campaigns,
        'audiences' => $audiences
    ]);
}
```

### Automated Reporting

Create a scheduled command to send daily performance reports:

```php
// In a console command
use App\Services\FacebookMarketingService;

public function handle()
{
    $facebookService = new FacebookMarketingService();

    // Get yesterday's performance
    $insights = $facebookService->getAdAccountInsights(
        fields: ['impressions', 'clicks', 'spend', 'conversions'],
        params: [
            'time_range' => json_encode([
                'since' => date('Y-m-d', strtotime('-1 day')),
                'until' => date('Y-m-d', strtotime('-1 day'))
            ])
        ]
    );

    // Send email report or log to ClickUp
    $this->sendReport($insights);
}
```

---

## Testing

### Test Facebook Pixel

1. Open your website with browser developer tools (F12)
2. Go to the Network tab
3. Filter for "facebook" or "fbevents"
4. You should see requests to `facebook.com/tr` with your Pixel ID
5. Submit the contact form and verify a "Lead" event is sent

### Test Marketing API

Create a test route to verify API connectivity:

```php
// In routes/web.php
Route::get('/test-facebook-api', function () {
    $service = new \App\Services\FacebookMarketingService();

    $insights = $service->getAdAccountInsights();

    return response()->json([
        'success' => $insights !== null,
        'data' => $insights
    ]);
});
```

Visit `/test-facebook-api` in your browser. You should see your ad account data if everything is configured correctly.

---

## Troubleshooting

### Pixel Not Firing

- Check browser console for JavaScript errors
- Verify `FACEBOOK_PIXEL_ID` is set in `.env`
- Run `php artisan config:clear` after changing `.env`
- Check that the pixel code is present in page source (View → Page Source)

### API Requests Failing

- Verify your access token hasn't expired
- Check that your token has the required permissions (`ads_read`, `ads_management`)
- Ensure the ad account ID is correct (numbers only, no "act_" prefix)
- Check Laravel logs in `storage/logs/laravel.log` for detailed error messages
- Verify your app is not in Development Mode (must be Live mode for production)

### Common Error Codes

- `190`: Access token expired or invalid
- `100`: Invalid parameter (check ad account ID format)
- `200`: Missing permissions on access token
- `17`: User request limit reached (rate limiting - wait and retry)

---

## Next Steps

1. **Set up Conversion API**: For more accurate tracking, implement server-side events alongside the pixel
2. **Build Admin Dashboard**: Create an interface to view campaign performance
3. **Automate Reporting**: Schedule daily/weekly reports to be sent via email or ClickUp
4. **Create Audience Segments**: Build custom audiences based on user behavior
5. **Implement A/B Testing**: Use the API to programmatically test different ad creatives

---

## Resources

- [Facebook Marketing API Documentation](https://developers.facebook.com/docs/marketing-apis/)
- [Facebook Pixel Documentation](https://developers.facebook.com/docs/meta-pixel)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Meta Business Help Center](https://www.facebook.com/business/help)
- [Marketing API Rate Limits](https://developers.facebook.com/docs/marketing-api/overview/rate-limiting)

---

## Security Notes

- Never commit your `.env` file to git
- Use long-lived or system user tokens for production
- Rotate access tokens regularly
- Monitor API usage to prevent unauthorized access
- Use HTTPS only for production deployment
- Consider using [Laravel Sanctum](https://laravel.com/docs/sanctum) for API authentication if building admin features

---

## Current Implementation Status

### Implemented
- Facebook Pixel tracking on all pages (via Landing.tsx)
- Lead event tracking on contact form submission
- FacebookMarketingService class for API interactions

### Available for Future Use
- Campaign management via Marketing API
- Custom audience creation
- Automated reporting
- Ad insights retrieval

---

## Support

For issues related to META API integration, contact:
- HardRock Development Team
- Email: dev@hardrock-co.com

For META/Facebook support:
- [Facebook Developer Community](https://developers.facebook.com/community/)
- [Business Help Center](https://www.facebook.com/business/help)
