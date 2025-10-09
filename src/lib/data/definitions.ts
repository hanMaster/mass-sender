export type Result = {
    success: boolean,
    error?: string,
}

export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    password: string;
};

export type UserForAdd = {
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

export type TemplateForAdd = {
    filename: string;
    comment: string;
};

export type TemplateForSelect = {
    id: string;
    comment: string;
};

export type NotificationRecord = {
    id: string;
    filename: string;
    filename_signed: string;
    comment: string;
    created_at: Date;
    deleted_at: Date;
}

export type NotificationForAdd = {
    filename: string;
    comment: string;
}

export type NotificationForSelect = {
    id: string;
    comment: string;
}