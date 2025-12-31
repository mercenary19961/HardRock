// User (for dashboard)
export interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
}

export interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth?: {
        user: User;
    };
};
