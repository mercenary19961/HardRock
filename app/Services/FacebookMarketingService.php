<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class FacebookMarketingService
{
    protected string $apiVersion = 'v22.0';
    protected string $baseUrl;
    protected ?string $accessToken;
    protected ?string $adAccountId;

    public function __construct()
    {
        $this->baseUrl = "https://graph.facebook.com/{$this->apiVersion}";
        $this->accessToken = config('services.facebook.access_token');
        $this->adAccountId = config('services.facebook.ad_account_id');
    }

    /**
     * Get ad account insights and performance metrics
     *
     * @param string|null $accountId
     * @param array $fields
     * @param array $params
     * @return array|null
     */
    public function getAdAccountInsights(?string $accountId = null, array $fields = [], array $params = []): ?array
    {
        try {
            $accountId = $accountId ?? $this->adAccountId;

            if (!$accountId) {
                throw new Exception('Ad Account ID is not configured');
            }

            $defaultFields = [
                'impressions',
                'clicks',
                'spend',
                'reach',
                'ctr',
                'cpc',
                'cpm',
                'conversions',
                'cost_per_conversion'
            ];

            $fields = !empty($fields) ? $fields : $defaultFields;

            $response = Http::withToken($this->accessToken)
                ->get("{$this->baseUrl}/act_{$accountId}/insights", array_merge([
                    'fields' => implode(',', $fields),
                    'time_range' => json_encode(['since' => date('Y-m-d', strtotime('-30 days')), 'until' => date('Y-m-d')]),
                ], $params));

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Facebook Marketing API Error: Failed to fetch ad account insights', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return null;
        } catch (Exception $e) {
            Log::error('Facebook Marketing API Exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get campaigns for an ad account
     *
     * @param string|null $accountId
     * @param array $fields
     * @return array|null
     */
    public function getCampaigns(?string $accountId = null, array $fields = []): ?array
    {
        try {
            $accountId = $accountId ?? $this->adAccountId;

            if (!$accountId) {
                throw new Exception('Ad Account ID is not configured');
            }

            $defaultFields = [
                'id',
                'name',
                'status',
                'objective',
                'daily_budget',
                'lifetime_budget',
                'created_time',
                'updated_time'
            ];

            $fields = !empty($fields) ? $fields : $defaultFields;

            $response = Http::withToken($this->accessToken)
                ->get("{$this->baseUrl}/act_{$accountId}/campaigns", [
                    'fields' => implode(',', $fields),
                ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Facebook Marketing API Error: Failed to fetch campaigns', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return null;
        } catch (Exception $e) {
            Log::error('Facebook Marketing API Exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get campaign insights
     *
     * @param string $campaignId
     * @param array $fields
     * @param array $params
     * @return array|null
     */
    public function getCampaignInsights(string $campaignId, array $fields = [], array $params = []): ?array
    {
        try {
            $defaultFields = [
                'campaign_name',
                'impressions',
                'clicks',
                'spend',
                'reach',
                'ctr',
                'cpc',
                'cpm',
                'conversions',
                'cost_per_conversion'
            ];

            $fields = !empty($fields) ? $fields : $defaultFields;

            $response = Http::withToken($this->accessToken)
                ->get("{$this->baseUrl}/{$campaignId}/insights", array_merge([
                    'fields' => implode(',', $fields),
                ], $params));

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Facebook Marketing API Error: Failed to fetch campaign insights', [
                'campaign_id' => $campaignId,
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return null;
        } catch (Exception $e) {
            Log::error('Facebook Marketing API Exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Create a new campaign
     *
     * @param string $name
     * @param string $objective
     * @param string $status
     * @param array $additionalParams
     * @return array|null
     */
    public function createCampaign(string $name, string $objective, string $status = 'PAUSED', array $additionalParams = []): ?array
    {
        try {
            $accountId = $this->adAccountId;

            if (!$accountId) {
                throw new Exception('Ad Account ID is not configured');
            }

            $params = array_merge([
                'name' => $name,
                'objective' => $objective,
                'status' => $status,
            ], $additionalParams);

            $response = Http::withToken($this->accessToken)
                ->post("{$this->baseUrl}/act_{$accountId}/campaigns", $params);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Facebook Marketing API Error: Failed to create campaign', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return null;
        } catch (Exception $e) {
            Log::error('Facebook Marketing API Exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Update an existing campaign
     *
     * @param string $campaignId
     * @param array $params
     * @return array|null
     */
    public function updateCampaign(string $campaignId, array $params): ?array
    {
        try {
            $response = Http::withToken($this->accessToken)
                ->post("{$this->baseUrl}/{$campaignId}", $params);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Facebook Marketing API Error: Failed to update campaign', [
                'campaign_id' => $campaignId,
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return null;
        } catch (Exception $e) {
            Log::error('Facebook Marketing API Exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get ad sets for a campaign
     *
     * @param string $campaignId
     * @param array $fields
     * @return array|null
     */
    public function getAdSets(string $campaignId, array $fields = []): ?array
    {
        try {
            $defaultFields = [
                'id',
                'name',
                'status',
                'daily_budget',
                'lifetime_budget',
                'targeting',
                'optimization_goal',
                'billing_event'
            ];

            $fields = !empty($fields) ? $fields : $defaultFields;

            $response = Http::withToken($this->accessToken)
                ->get("{$this->baseUrl}/{$campaignId}/adsets", [
                    'fields' => implode(',', $fields),
                ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Facebook Marketing API Error: Failed to fetch ad sets', [
                'campaign_id' => $campaignId,
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return null;
        } catch (Exception $e) {
            Log::error('Facebook Marketing API Exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get ads for an ad set
     *
     * @param string $adSetId
     * @param array $fields
     * @return array|null
     */
    public function getAds(string $adSetId, array $fields = []): ?array
    {
        try {
            $defaultFields = [
                'id',
                'name',
                'status',
                'creative',
                'tracking_specs'
            ];

            $fields = !empty($fields) ? $fields : $defaultFields;

            $response = Http::withToken($this->accessToken)
                ->get("{$this->baseUrl}/{$adSetId}/ads", [
                    'fields' => implode(',', $fields),
                ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Facebook Marketing API Error: Failed to fetch ads', [
                'ad_set_id' => $adSetId,
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return null;
        } catch (Exception $e) {
            Log::error('Facebook Marketing API Exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get custom audiences for targeting
     *
     * @param string|null $accountId
     * @return array|null
     */
    public function getCustomAudiences(?string $accountId = null): ?array
    {
        try {
            $accountId = $accountId ?? $this->adAccountId;

            if (!$accountId) {
                throw new Exception('Ad Account ID is not configured');
            }

            $response = Http::withToken($this->accessToken)
                ->get("{$this->baseUrl}/act_{$accountId}/customaudiences", [
                    'fields' => 'id,name,description,subtype,approximate_count,time_created'
                ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Facebook Marketing API Error: Failed to fetch custom audiences', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return null;
        } catch (Exception $e) {
            Log::error('Facebook Marketing API Exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Create a custom audience from website traffic (Pixel-based)
     *
     * @param string $name
     * @param string $description
     * @param array $rule
     * @param string|null $accountId
     * @return array|null
     */
    public function createCustomAudience(string $name, string $description, array $rule, ?string $accountId = null): ?array
    {
        try {
            $accountId = $accountId ?? $this->adAccountId;

            if (!$accountId) {
                throw new Exception('Ad Account ID is not configured');
            }

            $pixelId = config('services.facebook.pixel_id');

            $response = Http::withToken($this->accessToken)
                ->post("{$this->baseUrl}/act_{$accountId}/customaudiences", [
                    'name' => $name,
                    'description' => $description,
                    'subtype' => 'WEBSITE',
                    'customer_file_source' => 'USER_PROVIDED_ONLY',
                    'rule' => json_encode($rule),
                    'pixel_id' => $pixelId,
                ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Facebook Marketing API Error: Failed to create custom audience', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return null;
        } catch (Exception $e) {
            Log::error('Facebook Marketing API Exception: ' . $e->getMessage());
            return null;
        }
    }
}
