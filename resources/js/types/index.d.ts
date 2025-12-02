// Admin User (for future dashboard)
export interface User {
    id: number;
    name: string;
    email: string;
}

// Contact Form (to be implemented)
export interface ContactFormData {
    // TODO: Define contact form fields
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
