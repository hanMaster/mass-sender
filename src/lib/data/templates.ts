'use server'
import postgres from 'postgres';
import {Template, TemplateForAdd, TemplateForSelect} from "@/lib/data/definitions";
import {revalidatePath} from "next/cache";
import {encode} from "jose/base64url";

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

export async function fetchTemplateForSelect(): Promise<TemplateForSelect[]> {
    const data = await fetchTemplates();
    return data ? data.map(r => ({id: r.id, comment: r.comment})) : []
}

export async function addTemplate({file, comment}: TemplateForAdd) {
    try {
        const encoded = encode(file);
        await sql`
            INSERT INTO templates (file, comment)
            VALUES (${encoded}, ${comment})
        `;
    } catch {
        throw new Error('Database Error: Failed to add template.');
    }
}

export async function removeTemplate(id: string) {
    try {
        await sql`DELETE
                  FROM templates
                  WHERE id = ${id}`;
        revalidatePath('/templates');
    } catch {
        throw new Error('Database Error: Failed to remove template.');
    }
}

export async function fetchTemplateById(id: string): Promise<Template | null> {
    try {
        const rowList = await sql<Template[]>`
            SELECT *
            FROM templates
            WHERE id = ${id}`;
        return rowList[0] ?? null;

    } catch (error) {
        console.log('Database Error:', error);
        throw new Error('Database Error: Failed to fetch templates.');
    }
}

