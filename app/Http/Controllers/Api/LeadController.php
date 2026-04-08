<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LeadController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'phone_number' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'service_interest' => 'nullable|string|max:500',
        ]);

        $lead = Lead::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'phone_number' => $validated['phone_number'],
            'email' => $validated['email'] ?? null,
            'service_interest' => $validated['service_interest'] ?? null,
            'source' => 'breeze',
        ]);

        Log::info('Breeze AI lead received', [
            'lead_id' => $lead->id,
            'name' => $lead->first_name . ' ' . $lead->last_name,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lead received successfully',
            'lead_id' => $lead->id,
        ], 201);
    }
}
