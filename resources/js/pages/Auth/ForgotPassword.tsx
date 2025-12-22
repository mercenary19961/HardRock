import { FormEvent, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password" />
            <div className="min-h-screen flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-[420px]">
                    {/* Logo */}
                    <div className="flex flex-col items-center justify-center mb-12">
                        <a href="/" className="hover:opacity-80 transition-opacity">
                            <img
                                src="/images/logo-black.webp"
                                alt="HardRock"
                                className="h-10 w-auto dark:hidden"
                            />
                            <img
                                src="/images/logo-white.png"
                                alt="HardRock"
                                className="h-10 w-auto hidden dark:block"
                            />
                        </a>
                        <span className="text-3xl font-semibold mt-3 text-foreground">Forgot Password</span>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-10">
                        <p className="text-muted-foreground text-sm">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {/* Success Message */}
                    {status && (
                        <div className="mb-6 p-4 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                            <p className="text-sm text-green-700 dark:text-green-400">{status}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@hardrock-co.com"
                                value={data.email}
                                autoComplete="email"
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                className="h-12 bg-background border-border/60 focus:border-brand-purple"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-medium bg-brand-purple hover:bg-brand-purple/90"
                            size="lg"
                            disabled={processing}
                        >
                            {processing ? "Sending..." : "Send Reset Link"}
                        </Button>
                    </form>

                    {/* Back to Login */}
                    <div className="text-center text-sm text-muted-foreground mt-8">
                        <a
                            href={route('login')}
                            className="text-brand-purple hover:underline font-medium"
                        >
                            ← Back to Login
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
