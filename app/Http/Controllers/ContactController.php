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

            // Dispatch job to process email and ClickUp task asynchronously
            ProcessContactSubmission::dispatch($contact);

            Log::info('Contact processing job dispatched', ['contact_id' => $contact->id]);
        } catch (\Exception $e) {
            Log::error('Failed to create contact', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }

        return back()->with('success', 'Thank you for contacting us! We will get back to you soon.');
    }
}
