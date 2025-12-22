<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::orderBy('created_at', 'desc')->get();

        return Inertia::render('Dashboard/Contacts', [
            'contacts' => $contacts
        ]);
    }

    public function destroy(Contact $contact)
    {
        // Only admins can delete contacts
        if (!auth()->user()->is_admin) {
            abort(403, 'Unauthorized action.');
        }

        $contact->delete();

        return back()->with('success', 'Contact deleted successfully');
    }
}
