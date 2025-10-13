import postgres from "postgres";
import {MailingRecord, Result} from "@/lib/data/definitions";

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

export async function fetchMailings(): Promise<Result<MailingRecord[]>> {
    try {
        const data = await sql<MailingRecord[]>`
            SELECT *
            FROM mailings;
        `;
        return {success: true, data};
    } catch (error: any) {
        console.error('Database Error:', error);
        return {success: false, error: error.message};
    }
}