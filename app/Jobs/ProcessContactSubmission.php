<?php

namespace App\Jobs;

use App\Models\Contact;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;

class ProcessContactSubmission implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Contact $contact
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Send email notification
        try {
            Mail::send('emails.contact-notification', ['contact' => $this->contact], function ($message) {
                $message->to('sales@hardrock-co.com')
                    ->subject('New Contact Form Submission - HardRock Agency');
            });

            Log::info('Contact email sent successfully', ['contact_id' => $this->contact->id]);
        } catch (\Exception $e) {
            Log::error('Failed to send contact email', [
                'error' => $e->getMessage(),
                'contact_id' => $this->contact->id
            ]);
        }

        // Create ClickUp task
        $this->createClickUpTask();
    }

    /**
     * Create a ClickUp task for new contact submission
     */
    private function createClickUpTask()
    {
        $clickupApiKey = env('CLICKUP_API_KEY');
        $clickupListId = env('CLICKUP_LIST_ID');

        if (!$clickupApiKey || !$clickupListId) {
            Log::warning('ClickUp API key or List ID not configured');
            return;
        }

        try {
            $services = is_array($this->contact->services) ? implode(', ', $this->contact->services) : '';

            $taskName = "New Contact: {$this->contact->personal_name}";
            $taskDescription = "**Contact Information:**\n\n" .
                "**Name:** {$this->contact->personal_name}\n" .
                ($this->contact->company_name ? "**Company:** {$this->contact->company_name}\n" : "") .
                "**Email:** {$this->contact->email}\n" .
                "**Phone:** {$this->contact->phone_number}\n\n" .
                ($services ? "**Interested Services:** {$services}\n\n" : "") .
                ($this->contact->more_details ? "**Additional Details:**\n{$this->contact->more_details}" : "");

            $response = Http::withHeaders([
                'Authorization' => $clickupApiKey,
                'Content-Type' => 'application/json',
            ])->post("https://api.clickup.com/api/v2/list/{$clickupListId}/task", [
                'name' => $taskName,
                'description' => $taskDescription,
                'priority' => 2, // High priority
                'status' => 'to do',
                'tags' => ['Contact Form', 'Lead'],
            ]);

            if ($response->successful()) {
                Log::info('ClickUp task created successfully', [
                    'contact_id' => $this->contact->id,
                    'task_id' => $response->json()['id']
                ]);
            } else {
                Log::error('Failed to create ClickUp task', [
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);
            }
        } catch (\Exception $e) {
            Log::error('ClickUp task creation error', [
                'error' => $e->getMessage()
            ]);
        }
    }
}
