import postgres from "postgres";
import {NotificationForAdd, NotificationForSelect, NotificationRecord, Result} from "@/lib/data/definitions";

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

export async function fetchNotifications(): Promise<Result<NotificationRecord[]>> {
    try {
        const data = await sql<NotificationRecord[]>`
            SELECT *
            FROM notifications;
        `;
        return {success: true, data};
    } catch (error: any) {
        console.error('Database Error:', error);
        return {success: false, error: error.message};
    }
}

export async function fetchNotificationsForSelect(): Promise<Result<NotificationForSelect[]>> {
    const data = await fetchNotifications();
    if (!data.success) return data;
    const selectList = data.data!.map(r => ({id: r.id, comment: r.comment}));
    return {success: true, data: selectList};
}

export async function addNotification({startFile, comment}: NotificationForAdd): Promise<Result<void>> {
    try {
        await sql`
            INSERT INTO notifications (start_file, comment)
            VALUES (${startFile}, ${comment})
        `;
        return {success: true};
    } catch (error: any) {
        console.log('Database Error: Failed to add notification.', error);
        return {success: false, error: error.message};
    }
}

export async function fetchNotificationById(id: string): Promise<Result<NotificationRecord>> {
    try {
        const rowList = await sql<NotificationRecord[]>`
            SELECT *
            FROM notifications
            WHERE id = ${id}`;
        if (!rowList[0]) return {success: false};
        return {success: true, data: rowList[0]};

    } catch (error: any) {
        console.log('Database Error:', error);
        return {success: false, error: error.message};
    }
}