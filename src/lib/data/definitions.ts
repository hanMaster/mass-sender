export type Result<T> = {
    success: boolean,
    data?: T,
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
    file: string;
    comment: string;
    created_at: Date;
};

export type TemplateForAdd = {
    file: Uint8Array;
    comment: string;
};

export type TemplateForSelect = {
    id: string;
    comment: string;
};

export type NotificationRecord = {
    id: string;
    start_file: string;
    approved_file: string;
    sig_file: string;
    comment: string;
    created_at: Date;
    deleted_at: Date;
}

export type NotificationForAdd = {
    startFile: string;
    comment: string;
}

export type NotificationForSelect = {
    id: string;
    comment: string;
}

export type NotificationPayload = {
    houseNumber: string;
    date: Date;
    templateId: string;
    comment: string;
}

export type NotificationApprovedPayload = {
    id: string;
    approvedFile: Uint8Array;
    sigFile: Uint8Array;
    comment: string;
};