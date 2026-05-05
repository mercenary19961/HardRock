<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $contacts = $this->buildQuery($request)
            ->orderBy('created_at', 'desc')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('Dashboard/Contacts', [
            'contacts' => $contacts,
            'filters' => $this->filterState($request),
            'statuses' => Contact::STATUSES,
        ]);
    }

    public function update(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'status' => ['sometimes', 'string', 'in:' . implode(',', Contact::STATUSES)],
            'notes' => ['sometimes', 'nullable', 'string', 'max:5000'],
        ]);

        $contact->fill($validated)->save();

        return back()->with('success', 'Contact updated.');
    }

    public function destroy(Contact $contact)
    {
        $this->ensureAdmin();

        /** @var \Illuminate\Database\Eloquent\Model $contact */
        $contact->delete();

        return back()->with('success', 'Contact archived.');
    }

    public function restore(int $id)
    {
        $this->ensureAdmin();

        $contact = Contact::onlyTrashed()->findOrFail($id);
        $contact->restore();

        return back()->with('success', 'Contact restored.');
    }

    public function export(Request $request): StreamedResponse
    {
        $query = $this->buildQuery($request)->orderBy('created_at', 'desc');
        $filename = 'contacts-' . now()->format('Y-m-d-His') . '.csv';

        return response()->streamDownload(function () use ($query) {
            $out = fopen('php://output', 'w');
            fputcsv($out, [
                'Name', 'Company', 'Email', 'Phone', 'Services',
                'Status', 'Notes', 'More Details', 'Submitted',
            ]);
            $query->chunk(500, function ($rows) use ($out) {
                foreach ($rows as $c) {
                    fputcsv($out, [
                        $c->personal_name,
                        $c->company_name,
                        $c->email,
                        $c->phone_number,
                        is_array($c->services) ? implode('; ', $c->services) : '',
                        $c->status,
                        $c->notes,
                        $c->more_details,
                        $c->created_at?->toDateTimeString(),
                    ]);
                }
            });
            fclose($out);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    private function buildQuery(Request $request): Builder
    {
        $query = $request->boolean('archived')
            ? Contact::onlyTrashed()
            : Contact::query();

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function (Builder $q) use ($search) {
                $like = '%' . $search . '%';
                $q->where('personal_name', 'like', $like)
                    ->orWhere('email', 'like', $like)
                    ->orWhere('phone_number', 'like', $like)
                    ->orWhere('company_name', 'like', $like);
            });
        }

        $status = $request->query('status');
        if ($status && in_array($status, Contact::STATUSES, true)) {
            $query->where('status', $status);
        }

        if ($from = $request->date('from')) {
            $query->where('created_at', '>=', $from->startOfDay());
        }
        if ($to = $request->date('to')) {
            $query->where('created_at', '<=', $to->endOfDay());
        }

        return $query;
    }

    private function filterState(Request $request): array
    {
        return [
            'search' => (string) $request->query('search', ''),
            'status' => (string) $request->query('status', ''),
            'from' => (string) $request->query('from', ''),
            'to' => (string) $request->query('to', ''),
            'archived' => $request->boolean('archived'),
        ];
    }

    private function ensureAdmin(): void
    {
        $user = Auth::user();
        if (!$user || !$user->is_admin) {
            abort(403, 'Unauthorized action.');
        }
    }
}
