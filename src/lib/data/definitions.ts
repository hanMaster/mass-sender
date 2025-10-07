export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    password: string;
};

export type Template = {
    id: string;
    filename: string;
    comment: string;
    created_at: Date;
};