import postgres from "postgres";
import {NotificationForAdd, NotificationForSelect, NotificationRecord, Template} from "@/lib/data/definitions";

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

export async function fetchNotifications(): Promise<NotificationRecord[] | undefined> {
    try {
        return sql<NotificationRecord[]>`
            SELECT *
            FROM notifications;
        `;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch notifications.');
    }
}

export async function fetchNotificationsForSelect(): Promise<NotificationForSelect[]> {
    const data = await fetchNotifications();
    return data ? data.map(r => ({id: r.id, comment: r.comment})) : []
}

export async function addNotification({startFile, comment}: NotificationForAdd) {
    try {
        await sql`
            INSERT INTO notifications (start_file, comment)
            VALUES (${startFile}, ${comment})
        `;
    } catch {
        throw new Error('Database Error: Failed to add notification.');
    }
}

export async function fetchNotificationById(id: string): Promise<NotificationRecord | null> {
    try {
        const rowList = await sql<NotificationRecord[]>`
            SELECT *
            FROM notifications
            WHERE id = ${id}`;
        return rowList[0] ?? null;

    } catch (error) {
        console.log('Database Error:', error);
        throw new Error('Database Error: Failed to fetch notification.');
    }
}