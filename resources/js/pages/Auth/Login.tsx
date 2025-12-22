import { FormEvent } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { AnimatedCharactersLoginPage } from '@/components/ui/animated-characters-login-page';

interface User {
    id: number;
    name: string;
    email: string;
}

export default function Login() {
    const { auth } = usePage().props as { auth: { user: User | null } };
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title={auth.user ? "Dashboard" : "Team Login"} />
            <AnimatedCharactersLoginPage
                onSubmit={handleSubmit}
                email={data.email}
                password={data.password}
                remember={data.remember}
                setEmail={(email) => setData('email', email)}
                setPassword={(password) => setData('password', password)}
                setRemember={(remember) => setData('remember', remember)}
                processing={processing}
                errors={errors}
                isAuthenticated={!!auth.user}
                userName={auth.user?.name}
            />
        </>
    );
}
