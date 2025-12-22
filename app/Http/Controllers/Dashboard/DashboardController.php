<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalContacts = Contact::count();
        $newContactsThisWeek = Contact::where('created_at', '>=', Carbon::now()->subWeek())->count();
        $recentContacts = Contact::orderBy('created_at', 'desc')
            ->take(5)
            ->get(['id', 'personal_name', 'email', 'services', 'created_at']);

        return Inertia::render('Dashboard/Index', [
            'stats' => [
                'totalContacts' => $totalContacts,
                'newContactsThisWeek' => $newContactsThisWeek,
                'recentContacts' => $recentContacts,
            ],
        ]);
    }
}
