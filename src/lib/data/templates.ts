'use server'
import postgres from 'postgres';
import {Result, Template, TemplateForAdd, TemplateForSelect} from "@/lib/data/definitions";
import {revalidatePath} from "next/cache";
import {encode} from "jose/base64url";

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

export async function fetchTemplates(): Promise<Result<Template[]>> {
    try {
        const data = await sql<Template[]>`
            SELECT *
            FROM templates;
        `;
        return {success: true, data};
    } catch (error: any) {
        return {success: false, error: `Failed to add template. ${error.message}`};
    }
}

export async function fetchTemplateForSelect(): Promise<Result<TemplateForSelect[]>> {
    const res = await fetchTemplates();
    if (res.success && res.data) {
        return {...res, data: res.data.map(r => ({id: r.id, comment: r.comment}))};
    }
    return res;
}

export async function addTemplate({file, comment}: TemplateForAdd): Promise<Result<void>> {
    try {
        const encoded = encode(file);
        await sql`
            INSERT INTO templates (file, comment)
            VALUES (${encoded}, ${comment})
        `;
        return {success: true};
    } catch (error: any) {
        return {success: false, error: `Failed to add template. ${error.message}`};
    }
}

export async function removeTemplate(id: string): Promise<Result<void>> {
    try {
        await sql`DELETE
                  FROM templates
                  WHERE id = ${id}`;
        revalidatePath('/templates');
        return {success: true};
    } catch {
        return {success: false, error: 'Failed to remove template.'};
    }
}

export async function fetchTemplateById(id: string): Promise<Result<Template>> {
    try {
        const rowList = await sql<Template[]>`
            SELECT *
            FROM templates
            WHERE id = ${id}`;
        if (rowList[0]) {
            return {success: true, data: rowList[0]};
        }
        return {success: false, error: 'Template not found'};

    } catch (error: any) {
        console.log('Database Error:', error);
        return {success: false, error: `Failed to fetch template. ${error.message}`};
    }
}

