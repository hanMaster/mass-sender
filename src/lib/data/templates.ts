import postgres from 'postgres';
import {Template} from "@/lib/data/definitions";

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

export async function fetchTemplates(): Promise<Template[] | undefined> {
    try {
        const templates = await sql<Template[]>`
            SELECT * FROM templates;
        `;

        return templates;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch templates.');
    }
}