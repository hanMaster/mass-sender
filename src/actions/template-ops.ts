'use server';

import {uploadFormSchema} from '@/lib/schemas';
import {addTemplate} from "@/lib/data/templates";
import {TemplateForAdd} from "@/lib/data/definitions";

export async function uploadDocument(formData: FormData) {
    console.log('[uploadDocument] start')
    // Преобразуем FormData в объект для валидации
    const file = formData.get('file') as File;
    const comment = formData.get('comment') as string;
    const rawData = {file, comment};

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

        const payload: TemplateForAdd = {
            file: buffer,
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
