<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $leads = $this->buildQuery($request)
            ->orderBy('created_at', 'desc')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('Dashboard/Leads', [
            'leads' => $leads,
            'filters' => $this->filterState($request),
            'sources' => Lead::query()->select('source')->distinct()->pluck('source'),
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $query = $this->buildQuery($request)->orderBy('created_at', 'desc');
        $filename = 'leads-' . now()->format('Y-m-d-His') . '.csv';

        return response()->streamDownload(function () use ($query) {
            $out = fopen('php://output', 'w');
            fputcsv($out, [
                'First Name', 'Last Name', 'Phone', 'Email',
                'Service Interest', 'Source', 'Submitted',
            ]);
            $query->chunk(500, function ($rows) use ($out) {
                foreach ($rows as $l) {
                    fputcsv($out, [
                        $l->first_name,
                        $l->last_name,
                        $l->phone_number,
                        $l->email,
                        $l->service_interest,
                        $l->source,
                        $l->created_at?->toDateTimeString(),
                    ]);
                }
            });
            fclose($out);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    private function buildQuery(Request $request): Builder
    {
        $query = Lead::query();

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function (Builder $q) use ($search) {
                $like = '%' . $search . '%';
                $q->where('first_name', 'like', $like)
                    ->orWhere('last_name', 'like', $like)
                    ->orWhere('email', 'like', $like)
                    ->orWhere('phone_number', 'like', $like)
                    ->orWhere('service_interest', 'like', $like);
            });
        }

        if ($source = $request->query('source')) {
            $query->where('source', $source);
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
            'source' => (string) $request->query('source', ''),
            'from' => (string) $request->query('from', ''),
            'to' => (string) $request->query('to', ''),
        ];
    }
}
