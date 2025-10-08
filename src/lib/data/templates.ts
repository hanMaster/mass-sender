'use server'
import postgres from 'postgres';
import {Template, TemplateForAdd} from "@/lib/data/definitions";
import {revalidatePath} from "next/cache";
import {removeTemplateFile} from "@/actions/template-ops";

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

export async function fetchTemplates(): Promise<Template[] | undefined> {
    try {
        return sql<Template[]>`
            SELECT *
            FROM templates;
        `;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch templates.');
    }
}

export async function addTemplate({filename, comment}: TemplateForAdd) {
    try {
        await sql`
            INSERT INTO templates (filename, comment)
            VALUES (${filename}, ${comment})
        `;
    } catch {
        throw new Error('Database Error: Failed to add template.');
    }
}

export async function removeTemplate(id: string) {
    try {
        const row = await sql<Template[]>`SELECT * FROM templates WHERE id=${id};`;

        const filename = row[0].filename;
        await removeTemplateFile(filename);
        const data = await sql`DELETE
                               FROM templates
                               WHERE id = ${id}`;
        console.log('[removeTemplate] id: ', id, data);
        revalidatePath('/templates');
    } catch {
        throw new Error('Database Error: Failed to remove template.');
    }
}

