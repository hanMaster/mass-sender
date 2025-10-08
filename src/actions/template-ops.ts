'use server';

import {uploadFormSchema} from '@/lib/schemas';
import * as fs from "node:fs";
import {addTemplate} from "@/lib/data/templates";
import {TemplateForAdd} from "@/lib/data/definitions";

export async function uploadDocument(formData: FormData) {
    console.log('[uploadDocument] start')
    // Преобразуем FormData в объект для валидации
    const file = formData.get('file') as File;
    const comment = formData.get('comment') as string;

    const rawData = {
        file,
        comment
    };

    // Валидация данных
    const validatedData = uploadFormSchema.safeParse(rawData);

    if (!validatedData.success) {

        console.log('[validatedData]', validatedData.error)

        return {
            success: false,
            errors: validatedData.error.issues.map(m => m.message),
            message: 'Ошибка валидации данных'
        };
    }

    try {
        const {file: uploadedFile, comment: validatedComment} = validatedData.data;
        const rawBuffer = await uploadedFile.arrayBuffer();
        const buffer = new Uint8Array(rawBuffer);
        const filename = `template_${Date.now()}.docx`;
        const filePath = `./upload/${filename}`;
        fs.writeFile(filePath, buffer, (err) => {
            if (err) {
                console.error('Error writing binary file:', err);
                return;
            }
            console.log(`Binary file saved successfully to: ${filePath}`);
        });

        const payload: TemplateForAdd = {
            filename,
            comment: validatedComment,
        }
        await addTemplate(payload);

        return {
            success: true,
            message: `Файл "${uploadedFile.name}" успешно загружен!`
        };

    } catch (error) {
        console.error('Upload error:', error);
        return {
            success: false,
            message: 'Ошибка при загрузке файла на сервер'
        };
    }
}

export async function removeTemplateFile(filename: string) {
    const filePath = `./upload/${filename}`;
    fs.unlink (filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return;
        }
        console.log(`${filePath} deleted successfully`);
    });
}