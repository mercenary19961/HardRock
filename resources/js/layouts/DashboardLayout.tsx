import { PropsWithChildren } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { User } from '@/types';

interface DashboardLayoutProps extends PropsWithChildren {
    header?: string;
}

// Role badge with icon
const ShieldIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const RoleBadge = ({ isAdmin }: { isAdmin: boolean }) => {
    if (isAdmin) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-brand-purple/10 text-brand-purple" title="Admin">
                <ShieldIcon className="size-3.5" />
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300" title="Team Member">
            <UserIcon className="size-3.5" />
        </span>
    );
};

export default function DashboardLayout({ header, children }: DashboardLayoutProps) {
    const { auth } = usePage().props as { auth: { user: User } };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Navigation */}
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Logo */}
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <span className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent">
                                        HardRock
                                    </span>
                                </Link>
                            </div>

                            {/* Navigation Links */}
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <Link
                                    href={route('dashboard.index')}
                                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700 transition duration-150 ease-in-out"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={route('dashboard.contacts.index')}
                                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700 transition duration-150 ease-in-out"
                                >
                                    Contacts
                                </Link>

                                {/* Admin-only navigation items */}
                                {auth.user.is_admin && (
                                    <>
                                        <Link
                                            href={route('dashboard.users.index')}
                                            className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700 transition duration-150 ease-in-out"
                                        >
                                            Team Members
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* User Info & Logout */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {auth.user.name}
                                    </span>
                                    <RoleBadge isAdmin={auth.user.is_admin} />
                                </div>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                                >
                                    Logout
                                </Link>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center sm:hidden">
                            <div className="flex items-center gap-3">
                                <RoleBadge isAdmin={auth.user.is_admin} />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {auth.user.name}
                                </span>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="text-sm text-gray-700 dark:text-gray-300"
                                >
                                    Logout
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Header */}
            {header && (
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            {header}
                        </h2>
                    </div>
                </header>
            )}

            {/* Page Content */}
            <main className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
