import { FormEvent, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Admin Login" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-purple/10 via-white to-brand-red/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent mb-2">
                            HardRock
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">Admin Login</p>
                    </div>

                    {/* Login Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    autoComplete="email"
                                    required
                                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-transparent text-black dark:text-white ${
                                        focusedField === 'email'
                                            ? 'border-brand-purple dark:border-brand-red shadow-lg'
                                            : errors.email
                                            ? 'border-red-500'
                                            : 'border-gray-300 dark:border-gray-600'
                                    } focus:outline-none`}
                                    style={{
                                        caretColor: 'black',
                                    }}
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    autoComplete="current-password"
                                    required
                                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-transparent text-black dark:text-white ${
                                        focusedField === 'password'
                                            ? 'border-brand-purple dark:border-brand-red shadow-lg'
                                            : errors.password
                                            ? 'border-red-500'
                                            : 'border-gray-300 dark:border-gray-600'
                                    } focus:outline-none`}
                                    style={{
                                        caretColor: 'black',
                                    }}
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="remember"
                                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                                >
                                    Remember me
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-brand-purple to-brand-red text-white font-semibold py-3 px-6 rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                /* Fix caret color in dark mode */
                .dark input {
                    caret-color: white;
                }

                /* Override autofill styles */
                input:-webkit-autofill,
                input:-webkit-autofill:hover,
                input:-webkit-autofill:focus,
                input:-webkit-autofill:active {
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: #000000 !important;
                    transition: background-color 5000s ease-in-out 0s;
                    box-shadow: inset 0 0 20px 20px transparent !important;
                    color: #000000 !important;
                }

                .dark input:-webkit-autofill,
                .dark input:-webkit-autofill:hover,
                .dark input:-webkit-autofill:focus,
                .dark input:-webkit-autofill:active {
                    -webkit-text-fill-color: #ffffff !important;
                    color: #ffffff !important;
                }
            `}</style>
        </>
    );
}
