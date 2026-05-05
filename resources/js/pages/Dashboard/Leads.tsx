import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { useIsNavigating } from '@/hooks/useIsNavigating';

interface Lead {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string | null;
    service_interest: string | null;
    source: string;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedLeads {
    data: Lead[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface Filters {
    search: string;
    source: string;
    from: string;
    to: string;
}

interface LeadsProps {
    leads: PaginatedLeads;
    filters: Filters;
    sources: string[];
}

export default function Leads({ leads, filters, sources }: LeadsProps) {
    const navigating = useIsNavigating();
    const [search, setSearch] = useState(filters.search);
    const [sourceFilter, setSourceFilter] = useState(filters.source);
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);

    useEffect(() => {
        if (search === filters.search) return;
        const handler = setTimeout(() => updateFilters({ search }), 350);
        return () => clearTimeout(handler);
    }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

    const updateFilters = (changes: Partial<Filters>) => {
        const next = {
            search: changes.search ?? search,
            source: changes.source ?? sourceFilter,
            from: changes.from ?? from,
            to: changes.to ?? to,
        };
        const params: Record<string, string> = {};
        if (next.search) params.search = next.search;
        if (next.source) params.source = next.source;
        if (next.from) params.from = next.from;
        if (next.to) params.to = next.to;
        router.get(route('admin.leads.index'), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setSourceFilter('');
        setFrom('');
        setTo('');
        router.get(route('admin.leads.index'), {}, { preserveScroll: true, replace: true });
    };

    const exportUrl = () => {
        const params = new URLSearchParams();
        if (filters.search) params.set('search', filters.search);
        if (filters.source) params.set('source', filters.source);
        if (filters.from) params.set('from', filters.from);
        if (filters.to) params.set('to', filters.to);
        const qs = params.toString();
        return route('admin.leads.export') + (qs ? `?${qs}` : '');
    };

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    return (
        <DashboardLayout header="Leads (Breeze AI)">
            <Head title="Leads">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            {/* Toolbar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                        <Label htmlFor="search" className="text-xs">Search</Label>
                        <Input
                            id="search"
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Name, email, phone, service"
                        />
                    </div>
                    <div>
                        <Label htmlFor="source" className="text-xs">Source</Label>
                        <select
                            id="source"
                            value={sourceFilter}
                            onChange={(e) => {
                                setSourceFilter(e.target.value);
                                updateFilters({ source: e.target.value });
                            }}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm capitalize"
                        >
                            <option value="">All</option>
                            {sources.map((s) => (
                                <option key={s} value={s} className="capitalize">{s}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor="from" className="text-xs">From</Label>
                        <Input
                            id="from"
                            type="date"
                            value={from}
                            onChange={(e) => {
                                setFrom(e.target.value);
                                updateFilters({ from: e.target.value });
                            }}
                        />
                    </div>
                    <div>
                        <Label htmlFor="to" className="text-xs">To</Label>
                        <Input
                            id="to"
                            type="date"
                            value={to}
                            onChange={(e) => {
                                setTo(e.target.value);
                                updateFilters({ to: e.target.value });
                            }}
                        />
                    </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {leads.total} {leads.total === 1 ? 'lead' : 'leads'}
                        {(filters.search || filters.source || filters.from || filters.to) && (
                            <button onClick={clearFilters} className="ml-2 text-brand-purple hover:underline">
                                Clear filters
                            </button>
                        )}
                    </div>
                    <a
                        href={exportUrl()}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                    >
                        Export CSV
                    </a>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    {leads.data.length === 0 && !navigating ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">No leads match your filters.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Phone</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Service Interest</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Source</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Submitted</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {navigating ? (
                                        <TableSkeleton rows={6} cols={6} />
                                    ) : leads.data.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                                {lead.first_name} {lead.last_name}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                <a href={`tel:${lead.phone_number}`} className="text-brand-purple hover:text-brand-red">
                                                    {lead.phone_number}
                                                </a>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                {lead.email ? (
                                                    <a href={`mailto:${lead.email}`} className="text-brand-purple hover:text-brand-red">
                                                        {lead.email}
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-500">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm max-w-sm">
                                                {lead.service_interest ? (
                                                    <span className="text-gray-700 dark:text-gray-300 truncate block">
                                                        {lead.service_interest}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-500">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                                                    {lead.source}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(lead.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {leads.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Showing {leads.from ?? 0}–{leads.to ?? 0} of {leads.total}
                        </div>
                        <div className="flex gap-1">
                            {leads.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url || link.active}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                                        link.active
                                            ? 'bg-brand-purple text-white'
                                            : link.url
                                                ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
