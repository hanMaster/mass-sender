import postgres from "postgres";
import {NotificationForAdd, NotificationForSelect, NotificationRecord} from "@/lib/data/definitions";

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

export async function addNotification({filename, comment}: NotificationForAdd) {
    try {
        await sql`
            INSERT INTO notifications (filename, comment)
            VALUES (${filename}, ${comment})
        `;
    } catch {
        throw new Error('Database Error: Failed to add notification.');
    }
}
