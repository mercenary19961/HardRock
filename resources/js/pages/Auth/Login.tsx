import { FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { AnimatedCharactersLoginPage } from '@/components/ui/animated-characters-login-page';

export default function Login() {
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
            <Head title="Admin Login" />
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
            />
        </>
    );
}
