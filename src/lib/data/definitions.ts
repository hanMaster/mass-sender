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

export type MailingRecord = {
    id: string;
    project: string;
    house_number: string;
    notification_id: string;
    collect_status: string;
    is_mail_sent: boolean;
    created_at: Date;
    deleted_at: Date;
}

export type Mailings = {
    id: string;
    project: string;
    house_number: string;
    notification_comment: string;
    collect_status: string;
    is_mail_sent: boolean;
    created_at: Date;
    deleted_at: Date;
}

export type MailingForAdd = {
    project: string;
    houseNumber: string;
    notificationId: string;
}

export type MailListRecord = {
    id: string;
    mailing_id: string;
    project: string;
    funnel: string;
    house_number: string;
    deal_id: string;
    object_type: string;
    object_number: string;
    is_main_contact: boolean;
    full_name: string;
    phone: string;
    email: string;
    created_at: Date;
    deleted_at: Date;
}