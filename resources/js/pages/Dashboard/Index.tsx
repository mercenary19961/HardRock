import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Banner } from '@/components/ui/banner';
import { PageProps } from '@/types';

// Icons
const UsersIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const InboxIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
    </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

interface Contact {
    id: number;
    personal_name: string;
    email: string;
    services: string[];
    created_at: string;
}

interface DashboardStats {
    totalContacts: number;
    newContactsThisWeek: number;
    recentContacts: Contact[];
}

interface DashboardIndexProps extends PageProps {
    stats: DashboardStats;
}

export default function DashboardIndex({ stats, auth }: DashboardIndexProps) {

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <DashboardLayout>
            <Head title="Dashboard" />

            {/* Welcome Banner */}
            <Banner
                id="welcome-banner"
                variant="rainbow"
                height="2.5rem"
                className="rounded-lg mb-6"
            >
                <span className="relative z-10">
                    Welcome to HardRock Dashboard, {auth?.user.name}!
                </span>
            </Banner>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Total Contacts */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Total Contacts
                            </p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.totalContacts}
                            </p>
                        </div>
                        <div className="p-3 bg-brand-purple/10 rounded-full">
                            <InboxIcon className="size-6 text-brand-purple" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link
                            href={route('dashboard.contacts.index')}
                            className="text-sm text-brand-purple hover:underline inline-flex items-center gap-1"
                        >
                            View all contacts
                            <ArrowRightIcon className="size-3" />
                        </Link>
                    </div>
                </div>

                {/* New This Week */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                New This Week
                            </p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.newContactsThisWeek}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <TrendingUpIcon className="size-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {stats.newContactsThisWeek > 0 ? (
                                <span className="text-green-600 dark:text-green-400">
                                    +{stats.newContactsThisWeek} new inquiries
                                </span>
                            ) : (
                                'No new inquiries this week'
                            )}
                        </span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Quick Actions
                        </p>
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                            <UsersIcon className="size-5 text-gray-600 dark:text-gray-300" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Link
                            href={route('dashboard.contacts.index')}
                            className="block w-full text-left px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            View Contact Submissions
                        </Link>
                        {auth?.user.is_admin && (
                            <Link
                                href={route('dashboard.users.index')}
                                className="block w-full text-left px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Manage Team Members
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Recent Contact Submissions
                        </h3>
                        <Link
                            href={route('dashboard.contacts.index')}
                            className="text-sm text-brand-purple hover:underline"
                        >
                            View all
                        </Link>
                    </div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {stats.recentContacts.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <InboxIcon className="size-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">
                                No contact submissions yet
                            </p>
                        </div>
                    ) : (
                        stats.recentContacts.map((contact) => (
                            <div key={contact.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {contact.personal_name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                            {contact.email}
                                        </p>
                                        {contact.services.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {contact.services.slice(0, 3).map((service, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-purple/10 text-brand-purple"
                                                    >
                                                        {service}
                                                    </span>
                                                ))}
                                                {contact.services.length > 3 && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        +{contact.services.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4 flex-shrink-0 flex items-center gap-2 text-gray-400 dark:text-gray-500">
                                        <ClockIcon className="size-4" />
                                        <span className="text-xs">
                                            {formatDate(contact.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
