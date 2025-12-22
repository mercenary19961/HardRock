import { FormEvent, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Inline icons
const Eye = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOff = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m2 2 20 20" />
        <path d="M6.71 6.71a10.75 10.75 0 0 0-4.648 5.639 1 1 0 0 0 0 .696 10.747 10.747 0 0 0 18.858 4.135" />
        <path d="M18 18a10.75 10.75 0 0 0 3.938-5.639 1 1 0 0 0 0-.696A10.75 10.75 0 0 0 12.001 2c-1.5 0-2.924.306-4.222.852" />
        <path d="M15.536 15.536a3 3 0 0 1-4.072-4.072" />
    </svg>
);

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Reset Password" />
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
                        <span className="text-3xl font-semibold mt-3 text-foreground">Reset Password</span>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-10">
                        <p className="text-muted-foreground text-sm">
                            Enter your new password below.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                autoComplete="email"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                disabled
                                className="h-12 bg-muted border-border/60"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={data.password}
                                    autoComplete="new-password"
                                    autoFocus
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    className="h-12 pr-10 bg-background border-border/60 focus:border-brand-purple"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-5" />
                                    ) : (
                                        <Eye className="size-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation" className="text-sm font-medium">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="password_confirmation"
                                    type={showPasswordConfirmation ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={data.password_confirmation}
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                    className="h-12 pr-10 bg-background border-border/60 focus:border-brand-purple"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPasswordConfirmation ? (
                                        <EyeOff className="size-5" />
                                    ) : (
                                        <Eye className="size-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.password_confirmation}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-medium bg-brand-purple hover:bg-brand-purple/90"
                            size="lg"
                            disabled={processing}
                        >
                            {processing ? "Resetting..." : "Reset Password"}
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
