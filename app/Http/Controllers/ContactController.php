<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'personalName' => 'required|string|min:2',
                'companyName' => 'nullable|string|min:2',
                'phoneNumber' => 'required|string|min:7|max:15',
                'email' => 'required|email',
                'services' => 'nullable|array',
                'moreDetails' => 'nullable|string',
            ]);

            // Create contact record
            $contact = Contact::create([
                'personal_name' => $validated['personalName'],
                'company_name' => $validated['companyName'] ?? null,
                'phone_number' => $validated['phoneNumber'],
                'email' => $validated['email'],
                'services' => $validated['services'] ?? [],
                'more_details' => $validated['moreDetails'] ?? null,
            ]);

            Log::info('Contact created successfully', ['id' => $contact->id, 'email' => $contact->email]);

            // Create ClickUp task for new contact
            $this->createClickUpTask($contact);
        } catch (\Exception $e) {
            Log::error('Failed to create contact', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }

        // Send email notification (disabled until email server is configured)
        // TODO: Re-enable after Resend/SMTP setup
        // try {
        //     Mail::send('emails.contact-notification', ['contact' => $contact], function ($message) {
        //         $message->to('sales@hardrock-co.com')
        //             ->subject('New Contact Form Submission - HardRock Agency');
        //     });
        // } catch (\Exception $e) {
        //     // Log error but don't fail the request
        //     Log::error('Failed to send contact email: ' . $e->getMessage());
        // }

        // Just log the submission for now
        Log::info('New contact form submission', [
            'name' => $contact->personal_name,
            'email' => $contact->email,
            'company' => $contact->company_name,
        ]);

        return back()->with('success', 'Thank you for contacting us! We will get back to you soon.');
    }

    /**
     * Create a ClickUp task for new contact submission
     */
    private function createClickUpTask($contact)
    {
        $clickupApiKey = env('CLICKUP_API_KEY');
        $clickupListId = env('CLICKUP_LIST_ID');

        if (!$clickupApiKey || !$clickupListId) {
            Log::warning('ClickUp API key or List ID not configured');
            return;
        }

        try {
            $services = is_array($contact->services) ? implode(', ', $contact->services) : '';

            $taskName = "New Contact: {$contact->personal_name}";
            $taskDescription = "**Contact Information:**\n\n" .
                "**Name:** {$contact->personal_name}\n" .
                ($contact->company_name ? "**Company:** {$contact->company_name}\n" : "") .
                "**Email:** {$contact->email}\n" .
                "**Phone:** {$contact->phone_number}\n\n" .
                ($services ? "**Interested Services:** {$services}\n\n" : "") .
                ($contact->more_details ? "**Additional Details:**\n{$contact->more_details}" : "");

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
                    'contact_id' => $contact->id,
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
