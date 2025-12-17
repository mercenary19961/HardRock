<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Jobs\ProcessContactSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $startTime = microtime(true);
        Log::info('Form submission received', ['timestamp' => now()]);

        try {
            $validated = $request->validate([
                'personalName' => 'required|string|min:2',
                'companyName' => 'nullable|string|min:2',
                'phoneNumber' => 'required|string|min:7|max:15',
                'email' => 'required|email',
                'services' => 'nullable|array',
                'moreDetails' => 'nullable|string',
            ]);

            $validationTime = microtime(true);
            Log::info('Validation completed', ['duration_ms' => round(($validationTime - $startTime) * 1000, 2)]);

            // Create contact record
            $contact = Contact::create([
                'personal_name' => $validated['personalName'],
                'company_name' => $validated['companyName'] ?? null,
                'phone_number' => $validated['phoneNumber'],
                'email' => $validated['email'],
                'services' => $validated['services'] ?? [],
                'more_details' => $validated['moreDetails'] ?? null,
            ]);

            $dbTime = microtime(true);
            Log::info('Contact created successfully', [
                'id' => $contact->id,
                'email' => $contact->email,
                'duration_ms' => round(($dbTime - $validationTime) * 1000, 2)
            ]);

            // Dispatch job to process email and ClickUp task asynchronously
            ProcessContactSubmission::dispatch($contact);

            $dispatchTime = microtime(true);
            Log::info('Contact processing job dispatched', [
                'contact_id' => $contact->id,
                'duration_ms' => round(($dispatchTime - $dbTime) * 1000, 2),
                'total_ms' => round(($dispatchTime - $startTime) * 1000, 2)
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to create contact', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }

        // Return an empty Inertia response to avoid page reload
        return back();
    }
}
