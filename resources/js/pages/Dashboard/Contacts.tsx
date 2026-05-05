import { Head, router, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Contact {
    id: number;
    personal_name: string;
    company_name: string | null;
    phone_number: string;
    email: string;
    services: string[];
    more_details: string | null;
    status: string;
    notes: string | null;
    created_at: string;
    deleted_at: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedContacts {
    data: Contact[];
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
    status: string;
    from: string;
    to: string;
    archived: boolean;
}

interface ContactsProps {
    contacts: PaginatedContacts;
    filters: Filters;
    statuses: string[];
}

const STATUS_STYLES: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    contacted: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    closed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

const StatusBadge = ({ status }: { status: string }) => (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>
        {status}
    </span>
);

export default function Contacts({ contacts, filters, statuses }: ContactsProps) {
    const { auth } = usePage().props as { auth: { user: { is_admin: boolean } } };
    const isAdmin = auth.user.is_admin;

    const [search, setSearch] = useState(filters.search);
    const [statusFilter, setStatusFilter] = useState(filters.status);
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);
    const [activeId, setActiveId] = useState<number | null>(null);
    const [busyId, setBusyId] = useState<number | null>(null);

    const active = useMemo(
        () => contacts.data.find((c) => c.id === activeId) ?? null,
        [activeId, contacts.data]
    );

    // Debounced search
    useEffect(() => {
        if (search === filters.search) return;
        const handler = setTimeout(() => updateFilters({ search }), 350);
        return () => clearTimeout(handler);
    }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

    const updateFilters = (changes: Partial<Filters>) => {
        const next = {
            search: changes.search ?? search,
            status: changes.status ?? statusFilter,
            from: changes.from ?? from,
            to: changes.to ?? to,
            archived: changes.archived ?? filters.archived,
        };
        const params: Record<string, string | boolean> = {};
        if (next.search) params.search = next.search;
        if (next.status) params.status = next.status;
        if (next.from) params.from = next.from;
        if (next.to) params.to = next.to;
        if (next.archived) params.archived = '1';
        router.get(route('admin.contacts.index'), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const switchTab = (archived: boolean) => {
        if (archived === filters.archived) return;
        updateFilters({ archived });
    };

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('');
        setFrom('');
        setTo('');
        router.get(
            route('admin.contacts.index'),
            filters.archived ? { archived: '1' } : {},
            { preserveScroll: true, replace: true }
        );
    };

    const exportUrl = () => {
        const params = new URLSearchParams();
        if (filters.search) params.set('search', filters.search);
        if (filters.status) params.set('status', filters.status);
        if (filters.from) params.set('from', filters.from);
        if (filters.to) params.set('to', filters.to);
        if (filters.archived) params.set('archived', '1');
        const qs = params.toString();
        return route('admin.contacts.export') + (qs ? `?${qs}` : '');
    };

    const archive = (id: number) => {
        if (!confirm('Archive this contact? You can restore it later from the Archived tab.')) return;
        setBusyId(id);
        router.delete(route('admin.contacts.destroy', id), {
            preserveScroll: true,
            onFinish: () => {
                setBusyId(null);
                if (activeId === id) setActiveId(null);
            },
        });
    };

    const restore = (id: number) => {
        setBusyId(id);
        router.post(route('admin.contacts.restore', id), {}, {
            preserveScroll: true,
            onFinish: () => setBusyId(null),
        });
    };

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    return (
        <DashboardLayout header="Contact Submissions">
            <Head title="Contacts">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            {/* Tabs */}
            <div className="mb-4 flex gap-2 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => switchTab(false)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                        !filters.archived
                            ? 'border-brand-purple text-brand-purple'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                    Active
                </button>
                <button
                    onClick={() => switchTab(true)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                        filters.archived
                            ? 'border-brand-purple text-brand-purple'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                    Archived
                </button>
            </div>

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
                            placeholder="Name, email, phone, company"
                        />
                    </div>
                    <div>
                        <Label htmlFor="status" className="text-xs">Status</Label>
                        <select
                            id="status"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                updateFilters({ status: e.target.value });
                            }}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        >
                            <option value="">All</option>
                            {statuses.map((s) => (
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
                        {contacts.total} {contacts.total === 1 ? 'contact' : 'contacts'}
                        {(filters.search || filters.status || filters.from || filters.to) && (
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
                    {contacts.data.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">
                                {filters.archived ? 'No archived contacts.' : 'No contacts match your filters.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Company</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Contact</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Services</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Submitted</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {contacts.data.map((contact) => (
                                        <tr
                                            key={contact.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700/40 cursor-pointer"
                                            onClick={() => setActiveId(contact.id)}
                                        >
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{contact.personal_name}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{contact.company_name || '-'}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                <div className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
                                                    <a href={`mailto:${contact.email}`} className="text-brand-purple hover:text-brand-red">
                                                        {contact.email}
                                                    </a>
                                                    <a href={`tel:${contact.phone_number}`} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                                        {contact.phone_number}
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {contact.services.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1 max-w-xs">
                                                        {contact.services.slice(0, 2).map((service, i) => (
                                                            <span key={i} className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-brand-purple/10 text-brand-purple">
                                                                {service}
                                                            </span>
                                                        ))}
                                                        {contact.services.length > 2 && (
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">+{contact.services.length - 2}</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 dark:text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={contact.status} /></td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(contact.created_at)}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm" onClick={(e) => e.stopPropagation()}>
                                                {filters.archived ? (
                                                    isAdmin && (
                                                        <button
                                                            onClick={() => restore(contact.id)}
                                                            disabled={busyId === contact.id}
                                                            className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 disabled:opacity-50"
                                                        >
                                                            {busyId === contact.id ? 'Restoring…' : 'Restore'}
                                                        </button>
                                                    )
                                                ) : (
                                                    isAdmin && (
                                                        <button
                                                            onClick={() => archive(contact.id)}
                                                            disabled={busyId === contact.id}
                                                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                                                        >
                                                            {busyId === contact.id ? 'Archiving…' : 'Archive'}
                                                        </button>
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {contacts.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Showing {contacts.from ?? 0}–{contacts.to ?? 0} of {contacts.total}
                        </div>
                        <div className="flex gap-1">
                            {contacts.links.map((link, i) => (
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

            {/* Detail modal */}
            {active && (
                <ContactDetailModal
                    contact={active}
                    isAdmin={isAdmin}
                    statuses={statuses}
                    archived={filters.archived}
                    onClose={() => setActiveId(null)}
                />
            )}
        </DashboardLayout>
    );
}

interface ContactDetailModalProps {
    contact: Contact;
    isAdmin: boolean;
    statuses: string[];
    archived: boolean;
    onClose: () => void;
}

function ContactDetailModal({ contact, isAdmin, statuses, archived, onClose }: ContactDetailModalProps) {
    const [status, setStatus] = useState(contact.status);
    const [notes, setNotes] = useState(contact.notes ?? '');
    const [saving, setSaving] = useState(false);

    const dirty = status !== contact.status || (notes ?? '') !== (contact.notes ?? '');

    const save = () => {
        setSaving(true);
        router.put(
            route('admin.contacts.update', contact.id),
            { status, notes },
            {
                preserveScroll: true,
                onFinish: () => setSaving(false),
                onSuccess: () => onClose(),
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/50" />
                <div
                    className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-semibold">{contact.personal_name}</h2>
                            {contact.company_name && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">{contact.company_name}</p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                            <Label className="text-xs text-gray-500">Email</Label>
                            <a href={`mailto:${contact.email}`} className="block text-brand-purple hover:underline">
                                {contact.email}
                            </a>
                        </div>
                        <div>
                            <Label className="text-xs text-gray-500">Phone</Label>
                            <a href={`tel:${contact.phone_number}`} className="block">{contact.phone_number}</a>
                        </div>
                    </div>

                    {contact.services.length > 0 && (
                        <div className="mb-4">
                            <Label className="text-xs text-gray-500">Services</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {contact.services.map((s, i) => (
                                    <span key={i} className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-brand-purple/10 text-brand-purple">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {contact.more_details && (
                        <div className="mb-4">
                            <Label className="text-xs text-gray-500">Message</Label>
                            <p className="mt-1 text-sm whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 rounded-md p-3">
                                {contact.more_details}
                            </p>
                        </div>
                    )}

                    <div className="mb-4">
                        <Label htmlFor="modal-status" className="text-xs text-gray-500">Status</Label>
                        <select
                            id="modal-status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            disabled={archived}
                            className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm capitalize disabled:opacity-50"
                        >
                            {statuses.map((s) => (
                                <option key={s} value={s} className="capitalize">{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="modal-notes" className="text-xs text-gray-500">
                            Internal notes <span className="text-gray-400">(visible to team only)</span>
                        </Label>
                        <textarea
                            id="modal-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            disabled={archived}
                            rows={4}
                            className="mt-1 w-full px-3 py-2 rounded-md border border-input bg-background text-sm disabled:opacity-50"
                            placeholder="Follow-up notes, call summary, next steps…"
                        />
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        Submitted {new Date(contact.created_at).toLocaleString()}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>Close</Button>
                        {!archived && (
                            <Button
                                onClick={save}
                                disabled={!dirty || saving}
                                className="bg-brand-purple hover:bg-brand-purple/90"
                            >
                                {saving ? 'Saving…' : 'Save changes'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
